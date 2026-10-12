// POST /api/submit: the single endpoint behind all four forms.
// JS clients get JSON; plain HTML form posts get a 303 to the localised thank-you page.
import { validate, looksLikeSpam, schemas, type FormId } from '../../src/lib/validate.ts';
import { mailerFor } from '../../src/lib/mailer.ts';

interface Ctx { request: Request; env: Record<string, string | undefined> }

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });

export async function onRequestPost({ request, env }: Ctx) {
  const wantsJson = (request.headers.get('Accept') || '').includes('application/json');
  const type = request.headers.get('Content-Type') || '';
  if (!/multipart\/form-data|application\/x-www-form-urlencoded/.test(type)) return json({ ok: false, error: 'unsupported' }, 415);
  if (Number(request.headers.get('Content-Length') || 0) > 32_000) return json({ ok: false, error: 'too_large' }, 413);

  const data = await request.formData();
  const all: Record<string, string> = {};
  for (const [k, v] of data) if (typeof v === 'string') all[k] = v.slice(0, 4000);
  const form = all.form as FormId;
  const lang = ['en', 'nl', 'fr'].includes(all.lang) ? all.lang : 'en';
  const prefix = lang === 'en' ? '' : `/${lang}`;
  if (!(form in schemas)) return json({ ok: false, error: 'unknown_form' }, 400);

  // Bots get a quiet success so they learn nothing; nothing is sent.
  if (looksLikeSpam(all)) return wantsJson ? json({ ok: true }) : Response.redirect(new URL(`${prefix}/thanks?form=${form}`, request.url).toString(), 303);

  const result = validate(form, all);
  if (!result.ok) {
    if (wantsJson) return json({ ok: false, errors: result.errors }, 422);
    return Response.redirect(new URL(`${prefix}/oops?form=${form}`, request.url).toString(), 303);
  }

  const values = Object.fromEntries(Object.keys(schemas[form]).map((k) => [k, all[k] ?? '']));
  try {
    const sent = await mailerFor(env).send({ form, lang, values, receivedAt: new Date().toISOString() });
    if (!sent.ok) throw new Error('mailer');
  } catch {
    return wantsJson ? json({ ok: false, error: 'delivery' }, 502) : Response.redirect(new URL(`${prefix}/oops?form=${form}&reason=delivery`, request.url).toString(), 303);
  }
  return wantsJson ? json({ ok: true, preview: true }) : Response.redirect(new URL(`${prefix}/thanks?form=${form}`, request.url).toString(), 303);
}

export const onRequest = () => json({ ok: false, error: 'method_not_allowed' }, 405);
