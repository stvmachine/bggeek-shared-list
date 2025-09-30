import { test, expect } from "@playwright/test";

test.describe("Debug Username Functionality", () => {
  test("debug username adding process", async ({ page }) => {
    await page.goto("/collection");

    // Wait for page to load completely
    await page.waitForLoadState("networkidle");

    console.log("=== DEBUGGING USERNAME ADDING PROCESS ===");
    console.log("Page URL:", page.url());
    console.log("Page title:", await page.title());

    // Take a screenshot to see the current state
    await page.screenshot({ path: "debug-initial-state.png" });

    // Look for all input fields
    const inputs = page.locator("input");
    const inputCount = await inputs.count();
    console.log(`Found ${inputCount} input fields`);

    // Log details of each input
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const placeholder = await input.getAttribute("placeholder");
      const type = await input.getAttribute("type");
      const name = await input.getAttribute("name");
      const id = await input.getAttribute("id");
      const isVisible = await input.isVisible();
      console.log(
        `Input ${i}: type="${type}", name="${name}", id="${id}", placeholder="${placeholder}", visible=${isVisible}`
      );
    }

    // Look for the username input specifically
    const usernameInput = page
      .locator('input[placeholder*="username"]')
      .first();
    const usernameInputVisible = await usernameInput.isVisible();
    console.log(`Username input visible: ${usernameInputVisible}`);

    if (usernameInputVisible) {
      console.log("Found username input, filling with test username...");
      await usernameInput.fill("donutgamer");

      // Take screenshot after filling
      await page.screenshot({ path: "debug-after-fill.png" });

      // Look for buttons
      const buttons = page.locator("button");
      const buttonCount = await buttons.count();
      console.log(`Found ${buttonCount} buttons`);

      // Log details of each button
      for (let i = 0; i < Math.min(buttonCount, 10); i++) {
        const button = buttons.nth(i);
        const text = await button.textContent();
        const ariaLabel = await button.getAttribute("aria-label");
        const type = await button.getAttribute("type");
        const isVisible = await button.isVisible();
        console.log(
          `Button ${i}: text="${text}", aria-label="${ariaLabel}", type="${type}", visible=${isVisible}`
        );
      }

      // Look for add button
      const addButton = page
        .locator('button:has-text("Add"), button[aria-label*="Add"]')
        .first();
      const addButtonVisible = await addButton.isVisible();
      console.log(`Add button visible: ${addButtonVisible}`);

      if (addButtonVisible) {
        console.log("Clicking add button...");
        await addButton.click();

        // Wait a bit for any async operations
        await page.waitForTimeout(3000);

        // Take screenshot after clicking
        await page.screenshot({ path: "debug-after-click.png" });

        // Check if username appears anywhere
        const usernameText = page.getByText("donutgamer");
        const usernameVisible = await usernameText.isVisible();
        console.log(`Username "donutgamer" visible: ${usernameVisible}`);

        if (!usernameVisible) {
          console.log("Username not visible, checking for error messages...");

          // Look for error messages
          const errorMessages = page.locator(
            '[role="alert"], .error, [data-testid*="error"]'
          );
          const errorCount = await errorMessages.count();
          console.log(`Found ${errorCount} error messages`);

          for (let i = 0; i < errorCount; i++) {
            const error = errorMessages.nth(i);
            const errorText = await error.textContent();
            console.log(`Error ${i}: "${errorText}"`);
          }

          // Check for any loading states
          const loadingElements = page.locator(
            '[data-testid*="loading"], .loading, [aria-busy="true"]'
          );
          const loadingCount = await loadingElements.count();
          console.log(`Found ${loadingCount} loading elements`);

          // Check for any validation messages
          const validationMessages = page.locator(
            '.validation, .invalid, [aria-invalid="true"]'
          );
          const validationCount = await validationMessages.count();
          console.log(`Found ${validationCount} validation messages`);

          // Check the current page content
          const bodyText = await page.locator("body").textContent();
          console.log(
            "Current page content (first 500 chars):",
            bodyText?.substring(0, 500)
          );
        }
      } else {
        console.log("No add button found");
      }
    } else {
      console.log("No username input found");

      // Try to find any form
      const forms = page.locator("form");
      const formCount = await forms.count();
      console.log(`Found ${formCount} forms`);

      // Try any input as fallback
      const anyInput = inputs.first();
      if (await anyInput.isVisible()) {
        console.log("Trying with first input as fallback...");
        await anyInput.fill("donutgamer");

        const anyButton = buttons.first();
        if (await anyButton.isVisible()) {
          console.log("Clicking first button...");
          await anyButton.click();
          await page.waitForTimeout(3000);
        }
      }
    }

    // Final screenshot
    await page.screenshot({ path: "debug-final-state.png" });

    console.log("=== DEBUG COMPLETE ===");

    // The test should not fail - we're just debugging
    expect(true).toBeTruthy();
  });
});
