// Progressive enhancement for every [data-form]: inline validation on blur, an error summary
// linked to fields, an in-page fetch submission, and branded success and fallback states.
import { validate, validateField, type FormId } from '../lib/validate.ts';
import { sprinkle } from './sprinkles.ts';

export function values(form: HTMLFormElement): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of new FormData(form)) out[k] = typeof v === 'string' ? v : '';
  return out;
}

export function showError(form: HTMLFormElement, name: string, code: string | null) {
  const msgs = JSON.parse(form.dataset.errors || '{}');
  const field = form.querySelector<HTMLElement>(`[data-field="${name}"]`);
  const err = form.querySelector<HTMLElement>(`[id$="-${name}-err"]`);
  const input = form.querySelector<HTMLElement>(`[name="${name}"]`);
  field?.toggleAttribute('data-invalid', !!code);
  if (field) field.dataset.invalid = String(!!code);
  if (err) err.textContent = code ? msgs[code] || code : '';
  input?.setAttribute('aria-invalid', String(!!code));
}

/** Validate a set of fields; returns the names that failed. */
export function check(form: HTMLFormElement, names?: string[]) {
  const id = form.dataset.form as FormId;
  const all = values(form);
  const result = validate(id, all);
  const scope = names ?? Object.keys(result.errors).concat(Array.from(form.querySelectorAll<HTMLElement>('[data-field]')).map((f) => f.dataset.field!));
  const failed: string[] = [];
  for (const n of new Set(scope)) {
    const code = result.errors[n] ?? null;
    showError(form, n, code);
    if (code) failed.push(n);
  }
  return failed;
}

export function summarise(form: HTMLFormElement, failed: string[]) {
  const box = form.querySelector<HTMLElement>('[data-error-summary]')!;
  const list = box.querySelector('ul')!;
  list.replaceChildren();
  if (!failed.length) { box.hidden = true; return; }
  for (const n of failed) {
    const input = form.querySelector<HTMLElement>(`[name="${n}"]`);
    const label = (input?.id && form.querySelector(`label[for="${input.id}"]`)?.textContent) || input?.closest('fieldset')?.querySelector('legend')?.textContent || n;
    const msg = form.querySelector(`[id$="-${n}-err"]`)?.textContent || '';
    const li = document.createElement('li');
    const a = Object.assign(document.createElement('a'), { href: `#${input?.id ?? ''}`, textContent: `${label.replace(/\s*\(.*\)\s*$/, '').trim()}: ${msg}` });
    a.addEventListener('click', (e) => { e.preventDefault(); input?.focus(); });
    li.append(a); list.append(li);
  }
  box.hidden = false;
  box.focus();
}

for (const form of document.querySelectorAll<HTMLFormElement>('form[data-form]')) {
  const host = form.closest<HTMLElement>('[data-form-host]')!;
  const id = form.dataset.form as FormId;
  const stamp = form.querySelector<HTMLInputElement>('input[name="t"]')!;
  stamp.value = String(Date.now());

  form.addEventListener('focusout', (e) => {
    const el = e.target as HTMLInputElement;
    if (!el.name || el.type === 'radio' || !el.value) return;
    showError(form, el.name, validateField(id, el.name, values(form)));
  });
  form.addEventListener('input', (e) => {
    const el = e.target as HTMLInputElement;
    const field = el.name && form.querySelector<HTMLElement>(`[data-field="${el.name}"]`);
    if (field && field.dataset.invalid === 'true') showError(form, el.name, validateField(id, el.name, values(form)));
  });
  form.addEventListener('change', (e) => {
    const el = e.target as HTMLInputElement;
    // Native date and time pickers on phones rarely fire blur: validate them as soon as a value is picked.
    if ((el.type === 'date' || el.type === 'time') && el.value) showError(form, el.name, validateField(id, el.name, values(form)));
    else if (el.type === 'radio' || el.type === 'checkbox' || el.tagName === 'SELECT') {
      const field = form.querySelector<HTMLElement>(`[data-field="${el.name}"]`);
      if (field?.dataset.invalid === 'true') showError(form, el.name, validateField(id, el.name, values(form)));
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const failed = check(form);
    if (failed.length) { form.dispatchEvent(new CustomEvent('nc:invalid', { detail: failed })); summarise(form, failed); return; }
    summarise(form, []);
    const btn = form.querySelector<HTMLButtonElement>('.submit-btn')!;
    const fail = host.querySelector<HTMLElement>('[data-fail]')!;
    fail.dataset.show = 'false';
    btn.dataset.state = 'sending'; btn.disabled = true;
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        if (data.errors) { const f = Object.keys(data.errors); f.forEach((n) => showError(form, n, data.errors[n])); summarise(form, f); btn.dataset.state = 'idle'; btn.disabled = false; return; }
        throw new Error('submit failed');
      }
      btn.dataset.state = 'sent';
      form.dispatchEvent(new CustomEvent('nc:sent'));
      setTimeout(() => {
        form.hidden = true;
        const ok = host.querySelector<HTMLElement>('[data-success]')!;
        ok.dataset.show = 'true';
        ok.focus();
        sprinkle(70);
      }, 450);
    } catch {
      btn.dataset.state = 'idle'; btn.disabled = false;
      fail.dataset.show = 'true';
      fail.focus();
    }
  });
}
