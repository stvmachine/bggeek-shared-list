import { test, expect } from "@playwright/test";

test.describe("Debug Network and Component Behavior", () => {
  test("debug what happens after clicking add button", async ({ page }) => {
    await page.goto("/collection");

    // Wait for page to load
    await page.waitForLoadState("domcontentloaded");

    console.log("=== DEBUGGING NETWORK AND COMPONENT BEHAVIOR ===");

    // Set up network monitoring
    const requests: string[] = [];
    const responses: string[] = [];

    page.on("request", request => {
      if (request.url().includes("graphql") || request.url().includes("bgg")) {
        requests.push(`${request.method()} ${request.url()}`);
        console.log(`REQUEST: ${request.method()} ${request.url()}`);
      }
    });

    page.on("response", response => {
      if (
        response.url().includes("graphql") ||
        response.url().includes("bgg")
      ) {
        responses.push(`${response.status()} ${response.url()}`);
        console.log(`RESPONSE: ${response.status()} ${response.url()}`);
      }
    });

    // Find and fill username input
    const usernameInput = page
      .locator('input[placeholder*="username1, username2"]')
      .first();
    await usernameInput.fill("donutgamer");
    console.log('Filled username input with "donutgamer"');

    // Click add button
    const addButton = page.locator('button[aria-label="Add Username"]').first();
    await addButton.click();
    console.log("Clicked Add button");

    // Wait for any network activity
    await page.waitForTimeout(5000);

    console.log(`Total requests made: ${requests.length}`);
    console.log(`Total responses received: ${responses.length}`);

    // Check for any error messages in the console
    const consoleMessages: string[] = [];
    page.on("console", msg => {
      consoleMessages.push(`${msg.type()}: ${msg.text()}`);
      console.log(`CONSOLE ${msg.type()}: ${msg.text()}`);
    });

    // Wait a bit more for any async operations
    await page.waitForTimeout(3000);

    // Check if username appears in any form
    const usernameInPage = await page.locator("text=donutgamer").count();
    console.log(`Username "donutgamer" found ${usernameInPage} times in page`);

    // Check for any loading states
    const loadingElements = await page
      .locator('[data-testid*="loading"], .loading, [aria-busy="true"]')
      .count();
    console.log(`Loading elements found: ${loadingElements}`);

    // Check for any error states
    const errorElements = await page
      .locator('[data-testid*="error"], .error, [role="alert"]')
      .count();
    console.log(`Error elements found: ${errorElements}`);

    // Check the current state of the form
    const formInputs = await page.locator("input").count();
    console.log(`Form inputs found: ${formInputs}`);

    // Check if the input was cleared after submission
    const inputValue = await usernameInput.inputValue();
    console.log(`Username input value after click: "${inputValue}"`);

    // Look for any validation messages
    const validationMessages = await page
      .locator('.validation, .invalid, [aria-invalid="true"]')
      .count();
    console.log(`Validation messages found: ${validationMessages}`);

    // Check for any success indicators
    const successElements = await page
      .locator('[data-testid*="success"], .success')
      .count();
    console.log(`Success elements found: ${successElements}`);

    // Check the page content for any changes
    const bodyText = await page.locator("body").textContent();
    const hasCollectors = bodyText?.includes("collectors") || false;
    const hasNoCollectors = bodyText?.includes("No collectors") || false;
    console.log(`Page contains "collectors": ${hasCollectors}`);
    console.log(`Page contains "No collectors": ${hasNoCollectors}`);

    // Check if there are any badges or pills that might contain the username
    const badges = await page
      .locator('[data-testid*="badge"], .badge, [class*="badge"]')
      .count();
    console.log(`Badge elements found: ${badges}`);

    // Check for any pills or tags
    const pills = await page
      .locator('[data-testid*="pill"], .pill, [class*="pill"]')
      .count();
    console.log(`Pill elements found: ${pills}`);

    // Check for any member-related elements
    const memberElements = await page
      .locator('[data-testid*="member"], [class*="member"]')
      .count();
    console.log(`Member elements found: ${memberElements}`);

    console.log("=== DEBUG COMPLETE ===");

    // The test should not fail - we're just debugging
    expect(true).toBeTruthy();
  });
});
