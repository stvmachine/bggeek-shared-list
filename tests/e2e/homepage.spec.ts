import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page loads without errors
    await expect(page).toHaveTitle(/Shared Shelf/);
    
    // Check for main navigation elements
    await expect(page.locator('nav')).toBeVisible();
    
    // Check for main content area
    await expect(page.locator('main, [role="main"]')).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check if there's a link to collection page
    const collectionLink = page.locator('a[href*="/collection"]').first();
    if (await collectionLink.isVisible()) {
      await collectionLink.click();
      await expect(page).toHaveURL(/.*collection/);
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check that the page is still functional on mobile
    await expect(page.locator('body')).toBeVisible();
    
    // Check for mobile menu if it exists
    const mobileMenuButton = page.locator('[aria-label*="menu"], [data-testid*="menu"]').first();
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      // Verify mobile menu opens
      await expect(page.locator('nav')).toBeVisible();
    }
  });
});
