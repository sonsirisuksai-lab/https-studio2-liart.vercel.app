import { test, expect } from '@playwright/test';

test.describe('COSMOS v2.0 Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('1. CORE Dashboard loads', async ({ page }) => {
    await expect(page.locator('text=COSMOS Overview')).toBeVisible();
  });

  test('2. Can switch between all Tabs', async ({ page }) => {
    const tabs = ['WORK', 'THINK', 'STUDIO', 'LIFE', 'SIGNAL', 'SHORTCUTS', 'TRACKER', 'SHOPPING'];
    for (const tab of tabs) {
      await page.click(`a:has-text("${tab}")`);
      // Just verifying we can click without crashing
    }
  });

  // Additional checklist covered manually:
  /*
    3. [ ] WORK: เพิ่ม Task, ย้าย Column, ลบ Task
    4. [ ] THINK: เพิ่ม Note, ค้นหา, แก้ไข
    5. [ ] STUDIO: Sequencer เล่นได้
    6. [ ] LIFE: บันทึก Wellness Log
    7. [ ] SIGNAL: ส่งข้อความ
    8. [ ] MONEY: เพิ่ม Transaction
    9. [ ] SHORTCUTS: สร้าง Shortcut ด้วย AI
    10. [ ] LIBRARY: เพิ่ม Asset
    11. [ ] SHOPPING: เพิ่ม Wishlist/Purchase
    12. [ ] TRACKER: สร้าง Tracker, บันทึก Log
    13. [ ] STUDIO PRO: เปิดหน้าได้
    14. [ ] Light/Dark Theme สลับได้
    15. [ ] Responsive: Desktop, Tablet, Mobile
    16. [ ] Build: pnpm build ผ่าน 0 Error
  */
});
