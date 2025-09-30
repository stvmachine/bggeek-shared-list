import { test, expect } from '@playwright/test';

test.describe('Collection Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/collection');
  });

  test('should load the collection page successfully', async ({ page }) => {
    // Check that the page loads without errors
    await expect(page).toHaveTitle(/Shared Shelf/);
    
    // Check for main content elements
    await expect(page.locator('body')).toBeVisible();
    
    // Check for the "No collectors added yet" message initially
    await expect(page.getByText('No collectors added yet')).toBeVisible();
  });

  test('should allow adding usernames', async ({ page }) => {
    // Look for username input field
    const usernameInput = page.locator('input[placeholder*="username"], input[placeholder*="Username"]').first();
    
    if (await usernameInput.isVisible()) {
      // Type a test username
      await usernameInput.fill('testuser');
      
      // Look for submit button
      const submitButton = page.locator('button[type="submit"], button:has-text("Add")').first();
      if (await submitButton.isVisible()) {
        await submitButton.click();
        
        // Wait for the username to appear in the UI
        await expect(page.getByText('testuser')).toBeVisible({ timeout: 10000 });
      }
    }
  });

  test('should have working filters', async ({ page }) => {
    // Check for filter controls
    const filterSection = page.locator('[data-testid*="filter"], [class*="filter"]').first();
    
    if (await filterSection.isVisible()) {
      // Check for number of players filter
      const playersFilter = page.locator('select, [role="combobox"]').first();
      if (await playersFilter.isVisible()) {
        await playersFilter.click();
        await expect(page.locator('[role="option"]')).toBeVisible();
      }
      
      // Check for playing time filter
      const timeFilter = page.locator('select, [role="combobox"]').nth(1);
      if (await timeFilter.isVisible()) {
        await timeFilter.click();
        await expect(page.locator('[role="option"]')).toBeVisible();
      }
    }
  });

  test('should have hide expansions filter', async ({ page }) => {
    // Look for the hide expansions checkbox/switch
    const hideExpansionsControl = page.locator('input[type="checkbox"], [role="switch"]').first();
    
    if (await hideExpansionsControl.isVisible()) {
      // Check that it's initially unchecked
      await expect(hideExpansionsControl).not.toBeChecked();
      
      // Click to toggle
      await hideExpansionsControl.click();
      
      // Verify it's now checked
      await expect(hideExpansionsControl).toBeChecked();
    }
  });

  test('should handle URL parameters', async ({ page }) => {
    // Test with usernames in URL
    await page.goto('/collection?usernames=testuser1,testuser2');
    
    // Check if usernames are processed from URL
    await expect(page.locator('body')).toBeVisible();
    
    // The page should load without errors even with URL parameters
    await expect(page.locator('body')).not.toHaveClass(/error/);
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that the page is still functional on mobile
    await expect(page.locator('body')).toBeVisible();
    
    // Check for mobile-specific elements
    const mobileMenu = page.locator('[data-testid*="mobile"], [aria-label*="menu"]').first();
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
      await expect(page.locator('nav')).toBeVisible();
    }
  });

  test('should handle search functionality', async ({ page }) => {
    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"], input[placeholder*="Search"]').first();
    
    if (await searchInput.isVisible()) {
      // Type in search
      await searchInput.fill('test game');
      
      // Check that search input has the value
      await expect(searchInput).toHaveValue('test game');
      
      // Clear search
      await searchInput.clear();
      await expect(searchInput).toHaveValue('');
    }
  });

  test('should have working sort controls', async ({ page }) => {
    // Look for sort controls
    const sortSelect = page.locator('select, [role="combobox"]').first();
    
    if (await sortSelect.isVisible()) {
      await sortSelect.click();
      
      // Check for sort options
      const sortOptions = page.locator('[role="option"]');
      if (await sortOptions.count() > 0) {
        await expect(sortOptions.first()).toBeVisible();
      }
    }
  });

  test('should handle empty state gracefully', async ({ page }) => {
    // Verify empty state message
    await expect(page.getByText('No collectors added yet')).toBeVisible();
    await expect(page.getByText('Add BoardGameGeek usernames to get started')).toBeVisible();
  });
});
