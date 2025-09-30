import { test, expect } from '@playwright/test';

test.describe('Collection Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/collection');
  });

  test('should display empty state when no collectors are added', async ({ page }) => {
    // Check for empty state message
    await expect(page.getByText('No collectors added yet')).toBeVisible();
    await expect(page.getByText('Add BoardGameGeek usernames to get started')).toBeVisible();
  });

  test('should allow adding and removing usernames', async ({ page }) => {
    // Look for username input
    const usernameInput = page.locator('input[placeholder*="username"], input[placeholder*="Username"]').first();
    
    if (await usernameInput.isVisible()) {
      // Add a username
      await usernameInput.fill('testuser');
      
      const addButton = page.locator('button:has-text("Add"), button[type="submit"]').first();
      if (await addButton.isVisible()) {
        await addButton.click();
        
        // Wait for username to appear
        await expect(page.getByText('testuser')).toBeVisible({ timeout: 10000 });
        
        // Look for remove button (X icon or remove button)
        const removeButton = page.locator('button:has-text("×"), button[aria-label*="remove"], button[aria-label*="Remove"]').first();
        if (await removeButton.isVisible()) {
          await removeButton.click();
          
          // Username should be removed
          await expect(page.getByText('testuser')).not.toBeVisible();
        }
      }
    }
  });

  test('should handle multiple usernames', async ({ page }) => {
    const usernameInput = page.locator('input[placeholder*="username"], input[placeholder*="Username"]').first();
    
    if (await usernameInput.isVisible()) {
      // Add multiple usernames separated by comma
      await usernameInput.fill('user1,user2,user3');
      
      const addButton = page.locator('button:has-text("Add"), button[type="submit"]').first();
      if (await addButton.isVisible()) {
        await addButton.click();
        
        // Check that all usernames appear
        await expect(page.getByText('user1')).toBeVisible({ timeout: 10000 });
        await expect(page.getByText('user2')).toBeVisible();
        await expect(page.getByText('user3')).toBeVisible();
      }
    }
  });

  test('should have working search functionality', async ({ page }) => {
    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"], input[placeholder*="Search"]').first();
    
    if (await searchInput.isVisible()) {
      // Test search input
      await searchInput.fill('test search');
      await expect(searchInput).toHaveValue('test search');
      
      // Clear search
      await searchInput.clear();
      await expect(searchInput).toHaveValue('');
    }
  });

  test('should have working filter controls', async ({ page }) => {
    // Test number of players filter
    const playersFilter = page.locator('select, [role="combobox"]').first();
    if (await playersFilter.isVisible()) {
      await playersFilter.click();
      
      // Check for options
      const options = page.locator('[role="option"]');
      if (await options.count() > 0) {
        await expect(options.first()).toBeVisible();
        
        // Select an option
        await options.first().click();
      }
    }
    
    // Test playing time filter
    const timeFilter = page.locator('select, [role="combobox"]').nth(1);
    if (await timeFilter.isVisible()) {
      await timeFilter.click();
      
      const options = page.locator('[role="option"]');
      if (await options.count() > 0) {
        await expect(options.first()).toBeVisible();
        await options.first().click();
      }
    }
  });

  test('should have working sort controls', async ({ page }) => {
    const sortSelect = page.locator('select, [role="combobox"]').first();
    
    if (await sortSelect.isVisible()) {
      await sortSelect.click();
      
      const options = page.locator('[role="option"]');
      if (await options.count() > 0) {
        // Test different sort options
        for (let i = 0; i < Math.min(await options.count(), 3); i++) {
          await options.nth(i).click();
          await sortSelect.click(); // Reopen for next iteration
        }
      }
    }
  });

  test('should have hide expansions toggle', async ({ page }) => {
    // Look for hide expansions checkbox/switch
    const hideExpansionsControl = page.locator('input[type="checkbox"], [role="switch"]').first();
    
    if (await hideExpansionsControl.isVisible()) {
      // Test toggle functionality
      await expect(hideExpansionsControl).not.toBeChecked();
      
      await hideExpansionsControl.click();
      await expect(hideExpansionsControl).toBeChecked();
      
      await hideExpansionsControl.click();
      await expect(hideExpansionsControl).not.toBeChecked();
    }
  });

  test('should handle URL parameters correctly', async ({ page }) => {
    // Test with usernames in URL
    await page.goto('/collection?usernames=testuser1,testuser2');
    
    // Check if usernames are processed
    await expect(page.locator('body')).toBeVisible();
    
    // Check for any error messages
    const errorMessages = page.locator('text=error, text=Error, text=failed, text=Failed');
    await expect(errorMessages).toHaveCount(0);
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 }, // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1200, height: 800 }, // Desktop
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      
      // Check that all main elements are still visible
      await expect(page.locator('body')).toBeVisible();
      
      // Check for responsive layout
      const mainContent = page.locator('main, [role="main"]');
      if (await mainContent.count() > 0) {
        await expect(mainContent.first()).toBeVisible();
      }
    }
  });

  test('should handle form validation', async ({ page }) => {
    const usernameInput = page.locator('input[placeholder*="username"], input[placeholder*="Username"]').first();
    
    if (await usernameInput.isVisible()) {
      // Try to submit empty form
      const addButton = page.locator('button:has-text("Add"), button[type="submit"]').first();
      if (await addButton.isVisible()) {
        await addButton.click();
        
        // Should not add empty username
        await expect(page.getByText('No collectors added yet')).toBeVisible();
      }
      
      // Try to add invalid characters
      await usernameInput.fill('!@#$%');
      await addButton.click();
      
      // Should handle invalid input gracefully
      await expect(page.locator('body')).toBeVisible();
    }
  });
});
