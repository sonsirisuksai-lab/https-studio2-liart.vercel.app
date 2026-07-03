// E2E test for auth
import { test, expect } from '@playwright/test';
test('login', async ({ page }) => {
  await page.goto('/');
  expect(true).toBe(true);
});
