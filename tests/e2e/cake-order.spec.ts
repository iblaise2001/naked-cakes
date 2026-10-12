import { test, expect } from '@playwright/test';
import { humanise, firstPickupDate, goto } from './helpers.ts';

test.describe('cake order', () => {
  test('happy path: three steps, live estimate, branded success', async ({ page }) => {
    await goto(page, '/order-cake#build');
    const form = page.locator('form[data-form="cake"]');
    await expect(form.getByRole('button', { name: 'Send my cake request' })).toBeHidden();
    await form.getByRole('radio', { name: /^Large/ }).check();
    await form.getByRole('radio', { name: /^Heart/ }).check();
    await form.getByRole('radio', { name: /^Vintage/ }).check();
    await form.getByRole('radio', { name: /^Surprise me/ }).check();
    await form.getByRole('button', { name: '+ Ribbons' }).click();
    await form.getByRole('button', { name: '+ Ribbons' }).click();
    await expect(page.locator('[data-sum="total"]')).toHaveText('€167');
    await form.getByRole('button', { name: /Next/ }).first().click();
    await form.getByLabel('Pickup date').fill(firstPickupDate());
    await form.getByRole('button', { name: /Next/ }).first().click();
    await form.getByLabel('Your name').fill('Sam Peeters');
    await form.getByLabel('Email').fill('sam@example.com');
    await form.getByLabel('Phone').fill('0471 23 45 67');
    await humanise(page);
    await form.getByRole('button', { name: 'Send my cake request' }).click();
    const ok = page.locator('[data-form-host]:has(form[data-form="cake"]) [data-success]');
    await expect(ok).toBeVisible();
    await expect(ok).toBeFocused();
    await expect(ok).toContainText('Cake request received!');
    await expect(ok).toContainText('Preview build');
  });

  test('step 1 blocks Next with linked, plain-language errors', async ({ page }) => {
    await goto(page, '/order-cake#build');
    const form = page.locator('form[data-form="cake"]');
    await form.getByRole('button', { name: /Next/ }).first().click();
    const summary = form.locator('[data-error-summary]');
    await expect(summary).toBeVisible();
    await expect(summary.getByRole('link')).toHaveCount(4);
    await expect(form.locator('#cake-size-err')).toHaveText('We need this one.');
  });

  test('XL only allows the rectangle shape', async ({ page }) => {
    await goto(page, '/order-cake#build');
    const form = page.locator('form[data-form="cake"]');
    await form.getByRole('radio', { name: /^XL/ }).check();
    await expect(form.locator('input[name=shape][value=rectangle]')).toBeChecked();
    await expect(form.locator('input[name=shape][value=heart]')).toBeDisabled();
    await form.getByRole('radio', { name: /^Medium/ }).check();
    await expect(form.locator('input[name=shape][value=rectangle]')).toBeDisabled();
    await expect(form.locator('input[name=shape][value=rectangle]')).not.toBeChecked();
  });

  test('closed days are refused for pickup', async ({ page }) => {
    await goto(page, '/order-cake#build');
    const form = page.locator('form[data-form="cake"]');
    for (const label of ['Medium', 'Round', 'Basic', 'All white']) await form.getByRole('radio', { name: new RegExp(`^${label}`) }).check();
    await form.getByRole('button', { name: /Next/ }).first().click();
    // Find the next Monday at least 3 days out.
    const d = new Date(); d.setDate(d.getDate() + 3); while (d.getDay() !== 1) d.setDate(d.getDate() + 1);
    await form.getByLabel('Pickup date').fill(d.toISOString().slice(0, 10));
    await form.getByLabel('Pickup date').blur();
    await expect(form.locator('#cake-pickupDate-err')).toContainText('We are closed that day');
  });

  test('draft survives a reload', async ({ page }) => {
    await goto(page, '/order-cake#build');
    await page.locator('form[data-form="cake"]').getByRole('radio', { name: /^Fully Covered/ }).check();
    await page.reload();
    await expect(page.locator('input[name=style][value=covered]')).toBeChecked();
  });

  test('network failure shows the fallback, never a dead end', async ({ page }) => {
    await page.route('**/api/submit', (r) => r.abort());
    await goto(page, '/order-cake#build');
    const form = page.locator('form[data-form="cake"]');
    for (const label of ['Medium', 'Round', 'Basic', 'All white']) await form.getByRole('radio', { name: new RegExp(`^${label}`) }).check();
    await form.getByRole('button', { name: /Next/ }).first().click();
    await form.getByLabel('Pickup date').fill(firstPickupDate());
    await form.getByRole('button', { name: /Next/ }).first().click();
    await form.getByLabel('Your name').fill('Sam');
    await form.getByLabel('Email').fill('sam@example.com');
    await form.getByLabel('Phone').fill('+32 471 23 45 67');
    await humanise(page);
    await form.getByRole('button', { name: 'Send my cake request' }).click();
    const fail = page.locator('[data-form-host]:has(form[data-form="cake"]) [data-fail]');
    await expect(fail).toBeVisible();
    await expect(fail.getByRole('link', { name: /\+32 471 81 50 93/ })).toHaveAttribute('href', 'tel:+32471815093');
    await expect(form.getByRole('button', { name: 'Send my cake request' })).toBeEnabled();
  });
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('the whole cake form shows and posts to the thank-you page', async ({ page }) => {
    await page.goto('/order-cake');
    const form = page.locator('form[data-form="cake"]');
    for (const label of ['Large', 'Heart', 'Vintage', 'All white']) await form.getByRole('radio', { name: new RegExp(`^${label}`) }).check();
    await form.getByLabel('Pickup date').fill(firstPickupDate());
    await form.getByLabel('Your name').fill('Sam');
    await form.getByLabel('Email').fill('sam@example.com');
    await form.getByLabel('Phone').fill('0471234567');
    await form.getByRole('button', { name: 'Send my cake request' }).click();
    await expect(page).toHaveURL(/\/thanks\?form=cake$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Got it. Thank you!');
  });

  test('an incomplete post lands on the helpful oops page', async ({ page }) => {
    await page.goto('/visit');
    await page.locator('form[data-form="contact"]').getByRole('button', { name: 'Send message' }).click();
    await expect(page).toHaveURL(/\/oops\?form=contact$/);
    await expect(page.getByRole('main').getByRole('link', { name: 'yummy@nakedcakes.be' })).toBeVisible();
  });
});
