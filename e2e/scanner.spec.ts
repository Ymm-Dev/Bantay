import { expect, test } from '@playwright/test';

test('scam example shows a verdict, signal detail, and explanation', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: /bdo phishing link/i }).click();

  await expect(page.getByTestId('verdict-level')).toHaveText(/scam/i);
  await expect(page.getByTestId('signal-url.lookalike_brand')).toBeVisible();
  await expect(page.getByTestId('explanation')).not.toBeEmpty();
});

test('mobile layout fits without horizontal scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');

  await page.getByRole('button', { name: /bdo phishing link/i }).click();
  await expect(page.getByTestId('signal-url.lookalike_brand')).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );

  expect(overflow).toBeLessThanOrEqual(1);
});

test('the API rejects unknown fields', async ({ request }) => {
  const response = await request.post('/api/explain', {
    data: {
      level: 'safe',
      score: 0,
      signals: [],
      advice: [],
      text: 'raw message',
    },
  });

  expect(response.status()).toBe(400);
});
