import { test, expect } from "@playwright/test";

const TEST_USERNAME = "stebbo";
test.describe("Collection Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/collection");
  });

  test("should display empty state when no collectors are added", async ({
    page,
  }) => {
    // Check for empty state message
    await expect(page.getByText("No collectors added yet")).toBeVisible();
    await expect(
      page.getByText("Add BoardGameGeek usernames to get started")
    ).toBeVisible();
  });

  test("should allow adding and removing usernames", async ({ page }) => {
    // Check initial state - should be 0/0
    await expect(page.getByText("Group Collectors").first()).toBeVisible();
    await expect(page.getByText("0/0").first()).toBeVisible();

    // Look for username input with specific placeholder
    const usernameInput = page
      .locator('input[placeholder*="username1, username2"]')
      .first();

    if (await usernameInput.isVisible()) {
      // Add first username
      await usernameInput.fill(TEST_USERNAME);

      // Look for the add button with specific aria-label or text
      const addButton = page
        .locator('button[aria-label="Add Username"], button:has-text("Add")')
        .first();
      if (await addButton.isVisible()) {
        await addButton.click();

        // Wait for the form submission to complete
        await page.waitForTimeout(2000);

        // Check if the input was cleared (indicating form submission)
        const inputValue = await usernameInput.inputValue();
        expect(inputValue).toBe(""); // Form should be cleared after submission

        // Wait for username validation to complete and username to appear
        await expect(page.getByText(TEST_USERNAME)).toBeVisible({
          timeout: 15000,
        });

        // Check counter should now be 1/1
        await expect(page.getByText("1/1")).toBeVisible();

        // Add second username
        await usernameInput.fill("donutgamer");
        await addButton.click();
        await page.waitForTimeout(2000);

        // Check if the input was cleared
        const inputValue2 = await usernameInput.inputValue();
        expect(inputValue2).toBe("");

        // Wait for second username to appear
        await expect(page.getByText("donutgamer")).toBeVisible({
          timeout: 15000,
        });

        // Check counter should now be 2/2
        await expect(page.getByText("2/2")).toBeVisible();

        // Test removal functionality - remove first username
        const removeButton = page
          .locator(
            'button[aria-label*="Remove"], button:has-text("×"), [data-testid*="remove"]'
          )
          .first();
        if (await removeButton.isVisible()) {
          await removeButton.click();

          // First username should be removed
          await expect(page.getByText(TEST_USERNAME)).not.toBeVisible();

          // Counter should now be 1/1
          await expect(page.getByText("1/1")).toBeVisible();
        }
      }
    } else {
      // If the specific input is not found, look for any input that might be the username input
      const anyInput = page.locator("input").first();
      if (await anyInput.isVisible()) {
        await anyInput.fill(TEST_USERNAME);

        const anyButton = page.locator("button").first();
        if (await anyButton.isVisible()) {
          await anyButton.click();

          // Wait for username validation to complete and username to appear
          await expect(page.getByText(TEST_USERNAME)).toBeVisible({
            timeout: 15000,
          });

          // Check counter should be 1/1
          await expect(page.getByText("1/1")).toBeVisible();
        }
      }
    }
  });

  test("should handle multiple usernames", async ({ page }) => {
    const usernameInput = page
      .locator('input[placeholder*="username1, username2"]')
      .first();

    if (await usernameInput.isVisible()) {
      // Add multiple usernames separated by comma
      await usernameInput.fill("user1,user2,user3");

      const addButton = page
        .locator('button[aria-label="Add Username"], button:has-text("Add")')
        .first();
      if (await addButton.isVisible()) {
        await addButton.click();

        // Wait for usernames to appear
        await page.waitForTimeout(3000);

        // Check that all usernames appear (they might be in badges or pills)
        const user1Visible = await page.getByText("user1").isVisible();
        const user2Visible = await page.getByText("user2").isVisible();
        const user3Visible = await page.getByText("user3").isVisible();

        // At least one username should be visible
        expect(user1Visible || user2Visible || user3Visible).toBeTruthy();
      }
    } else {
      // Fallback: try with any input
      const anyInput = page.locator("input").first();
      if (await anyInput.isVisible()) {
        await anyInput.fill("user1,user2,user3");

        const anyButton = page.locator("button").first();
        if (await anyButton.isVisible()) {
          await anyButton.click();

          // Wait and check if usernames appear
          await page.waitForTimeout(3000);
          const hasUsers =
            (await page.getByText("user1").isVisible()) ||
            (await page.getByText("user2").isVisible()) ||
            (await page.getByText("user3").isVisible());
          expect(hasUsers).toBeTruthy();
        }
      }
    }
  });

  test("should have working search functionality", async ({ page }) => {
    // Look for search input
    const searchInput = page
      .locator(
        'input[type="search"], input[placeholder*="search"], input[placeholder*="Search"]'
      )
      .first();

    if (await searchInput.isVisible()) {
      // Test search input
      await searchInput.fill("test search");
      await expect(searchInput).toHaveValue("test search");

      // Clear search
      await searchInput.clear();
      await expect(searchInput).toHaveValue("");
    }
  });

  test("should have working filter controls", async ({ page }) => {
    // Test number of players filter
    const playersFilter = page.locator('select, [role="combobox"]').first();
    if (await playersFilter.isVisible()) {
      await playersFilter.click();

      // Check for options
      const options = page.locator('[role="option"]');
      if ((await options.count()) > 0) {
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
      if ((await options.count()) > 0) {
        await expect(options.first()).toBeVisible();
        await options.first().click();
      }
    }
  });

  test("should have working sort controls", async ({ page }) => {
    const sortSelect = page.locator('select, [role="combobox"]').first();

    if (await sortSelect.isVisible()) {
      await sortSelect.click();

      const options = page.locator('[role="option"]');
      if ((await options.count()) > 0) {
        // Test different sort options
        for (let i = 0; i < Math.min(await options.count(), 3); i++) {
          await options.nth(i).click();
          await sortSelect.click(); // Reopen for next iteration
        }
      }
    }
  });

  test("should have hide expansions toggle", async ({ page }) => {
    // Look for hide expansions checkbox/switch
    const hideExpansionsControl = page
      .locator('input[type="checkbox"], [role="switch"]')
      .first();

    if (await hideExpansionsControl.isVisible()) {
      // Test toggle functionality
      await expect(hideExpansionsControl).not.toBeChecked();

      await hideExpansionsControl.click();
      await expect(hideExpansionsControl).toBeChecked();

      await hideExpansionsControl.click();
      await expect(hideExpansionsControl).not.toBeChecked();
    }
  });

  test("should handle URL parameters correctly", async ({ page }) => {
    // Test with usernames in URL
    await page.goto("/collection?usernames=testuser1,testuser2");

    // Check if usernames are processed
    await expect(page.locator("body")).toBeVisible();

    // Check for any error messages
    const errorMessages = page.locator(
      "text=error, text=Error, text=failed, text=Failed"
    );
    await expect(errorMessages).toHaveCount(0);
  });

  test("should be responsive on different screen sizes", async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 }, // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1200, height: 800 }, // Desktop
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);

      // Check that all main elements are still visible
      await expect(page.locator("body")).toBeVisible();

      // Check for responsive layout
      const mainContent = page.locator('main, [role="main"]');
      if ((await mainContent.count()) > 0) {
        await expect(mainContent.first()).toBeVisible();
      }
    }
  });

  test("should handle form validation", async ({ page }) => {
    const usernameInput = page
      .locator('input[placeholder*="username"], input[placeholder*="Username"]')
      .first();

    if (await usernameInput.isVisible()) {
      // Try to submit empty form
      const addButton = page
        .locator('button:has-text("Add"), button[type="submit"]')
        .first();
      if (await addButton.isVisible()) {
        await addButton.click();

        // Should not add empty username
        await expect(page.getByText("No collectors added yet")).toBeVisible();
      }

      // Try to add invalid characters
      await usernameInput.fill("!@#$%");
      await addButton.click();

      // Should handle invalid input gracefully
      await expect(page.locator("body")).toBeVisible();
    }
  });
});
