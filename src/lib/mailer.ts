// Email delivery behind one interface. The preview build uses PreviewMailer (sends nothing).
// To go live: implement ResendMailer (owner summary + customer confirmation, reply-to set to the
// customer, inline-CSS table templates, no tracking pixels) and set MAIL_MODE=resend plus RESEND_API_KEY.
import type { FormId } from './validate.ts';

export interface Submission { form: FormId; lang: string; values: Record<string, string>; receivedAt: string }
export interface Mailer { send(s: Submission): Promise<{ ok: boolean; id?: string }> }

export class PreviewMailer implements Mailer {
  async send(s: Submission) {
    // Log only the shape, never the personal data.
    console.log(`[preview] ${s.form} (${s.lang}) fields=${Object.keys(s.values).join(',')}`);
    return { ok: true, id: 'preview' };
  }
}

export function mailerFor(env: Record<string, string | undefined>): Mailer {
  if (env.MAIL_MODE && env.MAIL_MODE !== 'preview') throw new Error(`MAIL_MODE=${env.MAIL_MODE} is not implemented yet`);
  return new PreviewMailer();
}
