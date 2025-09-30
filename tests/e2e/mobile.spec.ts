import { test, expect } from "@playwright/test";

test.describe("Mobile Experience", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
  });

  test("should work on mobile devices", async ({ page }) => {
    await page.goto("/");

    // Check that page loads on mobile
    await expect(page.locator("body")).toBeVisible();

    // Check for mobile-specific elements
    const mobileMenu = page
      .locator(
        '[data-testid*="mobile"], [aria-label*="menu"], button:has-text("Menu")'
      )
      .first();
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();

      // Check that mobile menu opens
      const mobileNav = page.locator('nav, [role="navigation"]');
      await expect(mobileNav).toBeVisible();
    }
  });

  test("should have touch-friendly interface", async ({ page }) => {
    await page.goto("/collection");

    // Check that buttons and inputs are large enough for touch
    const buttons = page.locator("button");
    const buttonCount = await buttons.count();

    for (let i = 0; i < Math.min(buttonCount, 3); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        const box = await button.boundingBox();
        if (box) {
          // Check minimum touch target size (44px is recommended)
          expect(box.width).toBeGreaterThanOrEqual(32);
          expect(box.height).toBeGreaterThanOrEqual(32);
        }
      }
    }
  });

  test("should handle mobile navigation", async ({ page }) => {
    await page.goto("/");

    // Test mobile navigation if it exists
    const mobileMenuButton = page
      .locator('[data-testid*="mobile-menu"], [aria-label*="menu"]')
      .first();
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();

      // Check that navigation is accessible
      const navLinks = page.locator("nav a");
      if ((await navLinks.count()) > 0) {
        await expect(navLinks.first()).toBeVisible();

        // Test navigation
        await navLinks.first().click();
      }
    }
  });

  test("should handle mobile forms", async ({ page }) => {
    await page.goto("/collection");

    // Test mobile form interaction
    const inputs = page.locator("input, select, textarea");
    const inputCount = await inputs.count();

    for (let i = 0; i < Math.min(inputCount, 2); i++) {
      const input = inputs.nth(i);
      if (await input.isVisible()) {
        await input.click();

        // Check that input is focused
        await expect(input).toBeFocused();

        // Test typing
        if ((await input.getAttribute("type")) !== "checkbox") {
          await input.fill("test");
          await expect(input).toHaveValue("test");
        }
      }
    }
  });

  test("should handle mobile scrolling", async ({ page }) => {
    await page.goto("/collection");

    // Test scrolling behavior
    await page.mouse.wheel(0, 100);
    await page.mouse.wheel(0, -100);

    // Page should still be functional
    await expect(page.locator("body")).toBeVisible();
  });

  test("should handle mobile orientation changes", async ({ page }) => {
    await page.goto("/");

    // Test landscape orientation
    await page.setViewportSize({ width: 667, height: 375 });
    await expect(page.locator("body")).toBeVisible();

    // Test portrait orientation
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator("body")).toBeVisible();
  });

  test("should have proper mobile viewport", async ({ page }) => {
    await page.goto("/");

    // Check viewport meta tag
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveCount(1);

    const viewportContent = await viewport.getAttribute("content");
    expect(viewportContent).toContain("width=device-width");
  });

  test("should handle mobile keyboard", async ({ page }) => {
    await page.goto("/collection");

    // Test mobile keyboard interaction
    const input = page.locator("input").first();
    if (await input.isVisible()) {
      await input.click();
      await input.fill("test");

      // Test mobile-specific keyboard events
      await page.keyboard.press("Enter");

      // Page should handle keyboard input
      await expect(page.locator("body")).toBeVisible();
    }
  });
});
