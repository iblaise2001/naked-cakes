import { test, expect } from '@playwright/test';
import { humanise } from './helpers.ts';

test('catering request: validation then success', async ({ page }) => {
  await page.goto('/catering#request');
  const form = page.locator('form[data-form="catering"]');
  await form.getByRole('button', { name: 'Send my request' }).click();
  await expect(form.locator('[data-error-summary]')).toBeVisible();
  await form.getByRole('radio', { name: /^The cart/ }).check();
  await form.getByLabel('First name').fill('Lien');
  await form.getByLabel('Last name').fill('Janssens');
  await form.getByLabel('Email').fill('lien@example.com');
  const d = new Date(); d.setDate(d.getDate() + 40);
  await form.getByLabel('Event date').fill(d.toISOString().slice(0, 10));
  await form.getByLabel('Type of event').fill('Store opening');
  await form.getByLabel('Location, venue or city').fill('Mechelen');
  await form.getByLabel('Number of guests').fill('120');
  await form.getByLabel('Hours', { exact: true }).fill('4');
  await humanise(page);
  await form.getByRole('button', { name: 'Send my request' }).click();
  await expect(page.locator('[data-form-host]:has(form[data-form="catering"]) [data-success]')).toContainText('within 72 hours');
});

test('contact form in Dutch speaks Dutch', async ({ page }) => {
  await page.goto('/nl/visit');
  const form = page.locator('form[data-form="contact"]');
  await form.getByLabel('E-mail').fill('niet-een-mail');
  await form.getByLabel('E-mail').blur();
  await expect(form.locator('#contact-email-err')).toHaveText('Dit e-mailadres lijkt niet te kloppen. Typfoutje?');
  await form.getByLabel('Voornaam').fill('An');
  await form.getByLabel('Achternaam').fill('Peeters');
  await form.getByLabel('E-mail').fill('an@example.com');
  await form.getByLabel('Bericht').fill('Hebben jullie parking in de buurt?');
  await humanise(page);
  await form.getByRole('button', { name: 'Verstuur bericht' }).click();
  await expect(page.locator('[data-form-host]:has(form[data-form="contact"]) [data-success]')).toContainText('Bericht ontvangen!');
});

test('Sweet Bite Club: consent required, birthday is day and month only', async ({ page }) => {
  await page.goto('/sweet-bite-club');
  const form = page.locator('form[data-form="club"]');
  await expect(form.locator('select[name=birthYear], input[name=birthYear]')).toHaveCount(0);
  await form.getByLabel('First name').fill('Noor');
  await form.getByLabel('Email').fill('noor@example.com');
  await form.locator('select[name=birthDay]').selectOption('14');
  await form.getByRole('button', { name: 'Let’s go!' }).click();
  await expect(form.locator('#club-consent-err')).toContainText('Tick the box');
  await expect(form.locator('#club-birthDay-err')).toContainText('both the day and the month');
  await form.locator('select[name=birthMonth]').selectOption('2');
  await form.getByLabel('I wanna subscribe. Yay!').check();
  await humanise(page);
  await form.getByRole('button', { name: 'Let’s go!' }).click();
  await expect(page.locator('[data-success]').first()).toContainText('You’re almost in!');
});

test('honeypot and too-fast submissions are swallowed by the endpoint', async ({ request }) => {
  const bot = await request.post('/api/submit', { headers: { Accept: 'application/json' }, form: { form: 'contact', lang: 'en', website: 'http://spam.example', firstName: 'x', lastName: 'y', email: 'x@y.zz', message: 'buy' } });
  expect(bot.status()).toBe(200);
  const invalid = await request.post('/api/submit', { headers: { Accept: 'application/json' }, form: { form: 'contact', lang: 'en', t: String(Date.now() - 10000), email: 'nope' } });
  expect(invalid.status()).toBe(422);
  const body = await invalid.json();
  expect(body.errors.email).toBe('email');
  expect(body.errors.firstName).toBe('required');
});
