import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validate, phoneOk, looksLikeSpam } from '../../src/lib/validate.ts';
import { firstPickupDate } from '../../src/lib/dates.ts';

test('phone formats', () => {
  for (const ok of ['0471 81 50 93', '+32 471 81 50 93', '0032471815093', '02 123 45 67', '+33 6 12 34 56 78']) assert.ok(phoneOk(ok), ok);
  for (const bad of ['123', 'abc', '+0471', '04718']) assert.ok(!phoneOk(bad), bad);
});

test('cake form happy path and rules', () => {
  const good = { size: 'large', shape: 'heart', style: 'vintage', frosting: 'surprise', ribbons: '2', cherries: '0',
    pickupDate: firstPickupDate(), name: 'Sam', email: 'sam@example.com', phone: '0471815093' };
  assert.deepEqual(validate('cake', good), { ok: true, errors: {} });
  assert.equal(validate('cake', { ...good, size: 'xl' }).errors.shape, 'shape');
  assert.equal(validate('cake', { ...good, email: 'nope' }).errors.email, 'email');
  assert.equal(validate('cake', { ...good, ribbons: '99' }).errors.ribbons, 'number');
  assert.equal(validate('cake', {}).errors.size, 'required');
});

test('club: birthday optional but both parts together, consent required', () => {
  const base = { firstName: 'Sam', email: 'sam@example.com', consent: 'yes' };
  assert.ok(validate('club', base).ok);
  assert.ok(validate('club', { ...base, birthDay: '3', birthMonth: '7' }).ok);
  assert.equal(validate('club', { ...base, birthDay: '3' }).errors.birthDay, 'birthday');
  assert.equal(validate('club', { ...base, consent: '' }).errors.consent, 'consent');
});

test('spam signals', () => {
  assert.ok(looksLikeSpam({ website: 'x' }));
  assert.ok(looksLikeSpam({ t: String(Date.now() - 500) }));
  assert.ok(!looksLikeSpam({ t: String(Date.now() - 10000) }));
});
