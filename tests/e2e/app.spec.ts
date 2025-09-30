import { test, expect } from "@playwright/test";

test.describe("Application", () => {
  test("should have proper meta tags", async ({ page }) => {
    await page.goto("/");

    // Check for basic meta tags
    await expect(page.locator("meta[charset]")).toHaveCount(1);
    await expect(page.locator('meta[name="viewport"]')).toHaveCount(1);
  });

  test("should have working navigation between pages", async ({ page }) => {
    await page.goto("/");

    // Check if we can navigate to collection page
    const collectionLink = page.locator('a[href*="/collection"]').first();
    if (await collectionLink.isVisible()) {
      await collectionLink.click();
      await expect(page).toHaveURL(/.*collection/);

      // Navigate back to home
      await page.goBack();
      await expect(page).toHaveURL("/");
    }
  });

  test("should handle browser back/forward navigation", async ({ page }) => {
    await page.goto("/");
    await page.goto("/collection");

    // Test back navigation
    await page.goBack();
    await expect(page).toHaveURL("/");

    // Test forward navigation
    await page.goForward();
    await expect(page).toHaveURL(/.*collection/);
  });

  test("should be accessible", async ({ page }) => {
    await page.goto("/");

    // Check for proper heading structure
    const headings = page.locator("h1, h2, h3, h4, h5, h6");
    if ((await headings.count()) > 0) {
      await expect(headings.first()).toBeVisible();
    }

    // Check for proper form labels
    const inputs = page.locator("input, select, textarea");
    const inputCount = await inputs.count();

    for (let i = 0; i < Math.min(inputCount, 5); i++) {
      const input = inputs.nth(i);
      if (await input.isVisible()) {
        // Check if input has proper labeling
        const hasLabel =
          (await input.getAttribute("aria-label")) ||
          (await input.getAttribute("aria-labelledby")) ||
          (await page
            .locator(`label[for="${await input.getAttribute("id")}"]`)
            .count()) > 0;

        // At least some inputs should have proper labeling
        if (i === 0) {
          expect(hasLabel).toBeTruthy();
        }
      }
    }
  });

  test("should handle keyboard navigation", async ({ page }) => {
    await page.goto("/");

    // Test tab navigation
    await page.keyboard.press("Tab");

    // Check that focus is visible
    const focusedElement = page.locator(":focus");
    if ((await focusedElement.count()) > 0) {
      await expect(focusedElement).toBeVisible();
    }

    // Test Enter key on focused element
    await page.keyboard.press("Enter");

    // Page should still be functional
    await expect(page.locator("body")).toBeVisible();
  });

  test("should handle different screen sizes", async ({ page }) => {
    const viewports = [
      { width: 320, height: 568 }, // Small mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1920, height: 1080 }, // Desktop
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto("/");

      // Check that page is still functional
      await expect(page.locator("body")).toBeVisible();

      // Check that main content is visible
      const mainContent = page.locator('main, [role="main"], .main-content');
      if ((await mainContent.count()) > 0) {
        await expect(mainContent.first()).toBeVisible();
      }
    }
  });

  test("should handle slow network conditions", async ({ page }) => {
    // Simulate slow network
    await page.route("**/*", route => {
      setTimeout(() => route.continue(), 1000);
    });

    await page.goto("/");

    // Page should still load
    await expect(page.locator("body")).toBeVisible({ timeout: 15000 });
  });

  test("should have proper error handling", async ({ page }) => {
    // Test with invalid URL
    await page.goto("/nonexistent-page");

    // Should either redirect or show 404
    const is404 =
      (await page
        .locator("text=404, text=Not Found, text=Page not found")
        .count()) > 0;
    const isRedirected =
      page.url().includes("/") && !page.url().includes("nonexistent");

    expect(is404 || isRedirected).toBeTruthy();
  });
});
