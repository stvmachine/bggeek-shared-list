import { test, expect } from "@playwright/test";

test.describe("Debug Validation Flow", () => {
  test("debug the username validation process", async ({ page }) => {
    await page.goto("/collection");

    console.log("=== DEBUGGING VALIDATION FLOW ===");

    // Monitor console logs to see what's happening
    const consoleMessages: string[] = [];
    page.on("console", msg => {
      const message = `${msg.type()}: ${msg.text()}`;
      consoleMessages.push(message);
      console.log(`CONSOLE: ${message}`);
    });

    // Monitor network requests
    const networkRequests: string[] = [];
    page.on("request", request => {
      if (request.url().includes("graphql") || request.url().includes("bgg")) {
        networkRequests.push(`${request.method()} ${request.url()}`);
        console.log(`NETWORK REQUEST: ${request.method()} ${request.url()}`);
      }
    });

    // Fill username input
    const usernameInput = page
      .locator('input[placeholder*="username1, username2"]')
      .first();
    await usernameInput.fill("donutgamer");
    console.log("Filled username input");

    // Click add button
    const addButton = page.locator('button[aria-label="Add Username"]').first();
    await addButton.click();
    console.log("Clicked Add button");

    // Wait for any async operations
    await page.waitForTimeout(5000);

    console.log(`Console messages captured: ${consoleMessages.length}`);
    console.log(`Network requests made: ${networkRequests.length}`);

    // Check if there are any pending states
    const pendingElements = await page
      .locator(
        '[data-testid*="pending"], [data-testid*="loading"], [aria-busy="true"]'
      )
      .count();
    console.log(`Pending/loading elements: ${pendingElements}`);

    // Check if there are any validation states
    const validationElements = await page
      .locator('[data-testid*="validation"], [data-testid*="validating"]')
      .count();
    console.log(`Validation elements: ${validationElements}`);

    // Check for any error messages
    const errorElements = await page
      .locator('[data-testid*="error"], .error, [role="alert"]')
      .count();
    console.log(`Error elements: ${errorElements}`);

    // Check if the input was cleared (indicating form submission)
    const inputValue = await usernameInput.inputValue();
    console.log(`Input value after submission: "${inputValue}"`);

    // Check for any success indicators
    const successElements = await page
      .locator('[data-testid*="success"], .success')
      .count();
    console.log(`Success elements: ${successElements}`);

    // Check if usernames appear anywhere in the page
    const usernameInPage = await page.locator("text=donutgamer").count();
    console.log(`Username "donutgamer" found ${usernameInPage} times in page`);

    // Check the current page state
    const bodyText = await page.locator("body").textContent();
    const hasPending = bodyText?.includes("pending") || false;
    const hasValidating = bodyText?.includes("validating") || false;
    const hasLoading = bodyText?.includes("loading") || false;
    console.log(`Page contains "pending": ${hasPending}`);
    console.log(`Page contains "validating": ${hasValidating}`);
    console.log(`Page contains "loading": ${hasLoading}`);

    // Check for any member-related elements
    const memberElements = await page
      .locator('[data-testid*="member"], [class*="member"]')
      .count();
    console.log(`Member elements: ${memberElements}`);

    // Check for any collector-related elements
    const collectorElements = await page
      .locator('[data-testid*="collector"], [class*="collector"]')
      .count();
    console.log(`Collector elements: ${collectorElements}`);

    // Check for any badge or pill elements that might contain usernames
    const badgeElements = await page
      .locator('[data-testid*="badge"], .badge, [class*="badge"]')
      .count();
    console.log(`Badge elements: ${badgeElements}`);

    // Check for any pill or tag elements
    const pillElements = await page
      .locator('[data-testid*="pill"], .pill, [class*="pill"]')
      .count();
    console.log(`Pill elements: ${pillElements}`);

    // Check for any username-related elements
    const usernameElements = await page
      .locator('[data-testid*="username"], [class*="username"]')
      .count();
    console.log(`Username elements: ${usernameElements}`);

    // Check for any form-related elements
    const formElements = await page.locator("form").count();
    console.log(`Form elements: ${formElements}`);

    // Check for any input elements
    const inputElements = await page.locator("input").count();
    console.log(`Input elements: ${inputElements}`);

    // Check for any button elements
    const buttonElements = await page.locator("button").count();
    console.log(`Button elements: ${buttonElements}`);

    // Check for any text that might indicate the current state
    const stateText = await page
      .locator(
        "text=pending, text=validating, text=loading, text=error, text=success"
      )
      .count();
    console.log(`State-related text elements: ${stateText}`);

    console.log("=== DEBUG COMPLETE ===");

    // The test should not fail - we're just debugging
    expect(true).toBeTruthy();
  });
});
