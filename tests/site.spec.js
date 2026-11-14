import { test, expect } from '@playwright/test';

for (const path of ['/', '/week2/']) {
  test(`${path} resources load, filter and persist progress`, async ({ page }) => {
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto(path); await expect(page.locator('.resource-card')).toHaveCount(4);
    await page.locator('[data-filter="2"]').click(); await expect(page.locator('.resource-card')).toHaveCount(1);
    await page.getByRole('checkbox', { name: 'Mark JAVASCRIPT as completed' }).check();
    await expect(page.locator('#progress-text')).toHaveText('1 of 4 resources completed');
    await expect(page.locator('#stat-resources')).toHaveText('1 / 4');
    await page.reload(); await expect(page.getByRole('checkbox', { name: 'Mark JAVASCRIPT as completed' })).toBeChecked();
    await page.locator('#reset-progress').click(); await expect(page.locator('#stat-resources')).toHaveText('0 / 4');
    expect(errors).toEqual([]);
  });
}
test('quiz scores correctly, saves the best score and can restart', async ({ page }) => {
  await page.goto('/'); await page.locator('#start-quiz').click();
  await expect(page.locator('#next-question')).toBeDisabled();
  for (const answer of [0, 1, 2, 3, 1]) {
    await page.locator('.quiz-option').nth(answer).click();
    await expect(page.locator('.quiz-feedback')).toContainText('That’s right!');
    await page.locator('#next-question').click();
  }
  await expect(page.locator('.quiz-result')).toHaveText('5 / 5');
  await expect(page.locator('#stat-quiz')).toHaveText('5 / 5');
  await page.locator('#retry-quiz').click(); await expect(page.locator('.quiz-progress')).toContainText('1 OF 5');
  await page.locator('.quiz-option').nth(1).click(); await expect(page.locator('.quiz-feedback')).toContainText('Keep going!');
  await page.keyboard.press('Escape'); await expect(page.locator('#quiz-dialog')).not.toBeVisible();
});
test('form validates, stores, downloads and deletes learner card', async ({ page }) => {
  await page.goto('/'); await page.locator('#join-form button[type=submit]').click();
  await expect(page.locator('#name-error')).toContainText('at least 2');
  await page.locator('#name').fill('Parikshat'); await page.locator('#email').fill('wrong');
  await page.locator('#join-form button[type=submit]').click(); await expect(page.locator('#email-error')).toContainText('valid email');
  await page.locator('#email').fill('student@example.com'); await page.locator('#consent').check();
  await page.locator('#join-form button[type=submit]').click(); await expect(page.locator('#learner-dialog')).toBeVisible();
  await expect(page.locator('#learner-greeting')).toContainText('Parikshat');
  const download = page.waitForEvent('download'); await page.locator('#download-card').click(); expect((await download).suggestedFilename()).toBe('skill-circle-learner-card.txt');
  await page.keyboard.press('Escape'); await page.reload(); await page.getByRole('button', { name: 'View your learner card' }).click();
  await page.locator('#delete-card').click(); await expect(page.locator('#form-status')).toContainText('deleted');
  expect(await page.evaluate(() => localStorage.getItem('skill-circle:learner'))).toBeNull();
});
test('event filters, search and dialogs work', async ({ page }) => {
  await page.goto('/'); await expect(page.locator('.event-card')).toHaveCount(4);
  await page.locator('[data-event-filter=skills]').click(); await expect(page.locator('.event-card')).toHaveCount(1);
  await page.locator('.event-more').click(); await expect(page.locator('#event-title')).toHaveText('Skill Synergy');
  await page.keyboard.press('Escape'); await page.locator('[data-event-filter=all]').click();
  await page.locator('#event-search').fill('not-an-event'); await expect(page.locator('#events-empty')).toBeVisible();
  await page.locator('#event-search').fill('defence'); await expect(page.locator('.event-card')).toHaveCount(1);
  await page.locator('[data-gallery]').first().click(); await expect(page.locator('#gallery-dialog')).toBeVisible();
  await expect(page.locator('#gallery-image')).toHaveJSProperty('complete', true); await page.keyboard.press('Escape');
});
test('theme, playground and mobile navigation work', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto('/');
  await page.locator('#menu-toggle').click(); await expect(page.locator('#mobile-nav')).toBeVisible();
  await page.locator('#mobile-nav a[href="#resources"]').click(); await expect(page.locator('#mobile-nav')).not.toBeVisible();
  await page.locator('#theme-toggle').click(); await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload(); await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.locator('#radius-input').fill('30'); await expect(page.locator('#css-output')).toContainText('30px');
  await page.locator('#reset-playground').click(); await expect(page.locator('#css-output')).toContainText('12px');
});
test('fetch errors have an actionable message', async ({ page }) => {
  await page.route('**/data/resources.json', route => route.abort()); await page.goto('/');
  await expect(page.locator('#resource-error')).toBeVisible(); await expect(page.locator('#resource-error')).toContainText('could not load');
});
for (const width of [320, 390, 768, 1440]) {
  test(`all editions fit at ${width}px with no broken images or links`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ['/', '/week1/', '/week2/']) {
      await page.goto(path); await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect(await page.locator('a[href^="#"]').evaluateAll(links => links.map(link => link.hash).filter(hash => hash.length > 1 && !document.getElementById(decodeURIComponent(hash.slice(1)))))).toEqual([]);
      if (path === '/week1/') { await expect(page.locator('script')).toHaveCount(0); await expect(page.locator('.resource-card')).toHaveCount(3); await expect(page.locator('button')).toHaveCount(0); }
    }
  });
}
test('local page assets return successful responses', async ({ page, request }) => {
  for (const path of ['/', '/week1/', '/week2/']) {
    await page.goto(path);
    const assets = await page.locator('img[src], link[rel=stylesheet], script[src]').evaluateAll(elements => elements.map(element => element.src || element.href).filter(url => url.startsWith(location.origin)));
    for (const url of new Set(assets)) expect((await request.get(url)).ok(), url).toBe(true);
  }
});
test('week1 remains usable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false }); const page = await context.newPage();
  await page.goto('http://127.0.0.1:3000/week1/'); await expect(page.locator('h1')).toContainText('BEYOND');
  await expect(page.locator('.resource-card')).toHaveCount(3); await page.locator('summary').first().click();
  await expect(page.locator('details').first()).toHaveAttribute('open', ''); await context.close();
});
