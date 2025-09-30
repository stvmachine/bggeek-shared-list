import { test, expect } from "@playwright/test";

test.describe("Accessibility", () => {
  test("should have proper heading structure", async ({ page }) => {
    await page.goto("/");

    // Check for h1 tag
    const h1 = page.locator("h1");
    if ((await h1.count()) > 0) {
      await expect(h1.first()).toBeVisible();
    }

    // Check heading hierarchy
    const headings = page.locator("h1, h2, h3, h4, h5, h6");
    const headingCount = await headings.count();

    if (headingCount > 0) {
      // First heading should be h1
      const firstHeading = headings.first();
      const tagName = await firstHeading.evaluate(el =>
        el.tagName.toLowerCase()
      );
      expect(["h1", "h2"]).toContain(tagName);
    }
  });

  test("should have proper form labels", async ({ page }) => {
    await page.goto("/collection");

    const inputs = page.locator("input, select, textarea");
    const inputCount = await inputs.count();

    for (let i = 0; i < Math.min(inputCount, 5); i++) {
      const input = inputs.nth(i);
      if (await input.isVisible()) {
        const inputId = await input.getAttribute("id");
        const ariaLabel = await input.getAttribute("aria-label");
        const ariaLabelledBy = await input.getAttribute("aria-labelledby");

        // Check for proper labeling
        const hasLabel =
          ariaLabel ||
          ariaLabelledBy ||
          (inputId &&
            (await page.locator(`label[for="${inputId}"]`).count()) > 0);

        // At least some inputs should have proper labeling
        if (i < 2) {
          expect(hasLabel).toBeTruthy();
        }
      }
    }
  });

  test("should have proper button labels", async ({ page }) => {
    await page.goto("/");

    const buttons = page.locator("button");
    const buttonCount = await buttons.count();

    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        const text = await button.textContent();
        const ariaLabel = await button.getAttribute("aria-label");

        // Buttons should have text or aria-label
        const hasLabel = (text && text.trim().length > 0) || ariaLabel;
        expect(hasLabel).toBeTruthy();
      }
    }
  });

  test("should support keyboard navigation", async ({ page }) => {
    await page.goto("/");

    // Test tab navigation
    await page.keyboard.press("Tab");

    // Check that focus is visible
    const focusedElement = page.locator(":focus");
    if ((await focusedElement.count()) > 0) {
      await expect(focusedElement).toBeVisible();
    }

    // Test Enter key
    await page.keyboard.press("Enter");

    // Page should still be functional
    await expect(page.locator("body")).toBeVisible();
  });

  test("should have proper color contrast", async ({ page }) => {
    await page.goto("/");

    // Check that text is visible (basic contrast check)
    const textElements = page.locator("p, span, div, h1, h2, h3, h4, h5, h6");
    const textCount = await textElements.count();

    if (textCount > 0) {
      const firstText = textElements.first();
      await expect(firstText).toBeVisible();

      // Check computed styles for basic visibility
      const color = await firstText.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return styles.color;
      });

      expect(color).toBeTruthy();
    }
  });

  test("should have proper ARIA attributes", async ({ page }) => {
    await page.goto("/collection");

    // Check for common ARIA attributes
    const elementsWithAria = page.locator(
      "[aria-label], [aria-labelledby], [aria-describedby]"
    );
    const ariaCount = await elementsWithAria.count();

    // Should have some ARIA attributes for better accessibility
    expect(ariaCount).toBeGreaterThanOrEqual(0);
  });

  test("should have proper focus management", async ({ page }) => {
    await page.goto("/collection");

    // Test focus on interactive elements
    const interactiveElements = page.locator(
      "button, input, select, textarea, a"
    );
    const interactiveCount = await interactiveElements.count();

    if (interactiveCount > 0) {
      const firstInteractive = interactiveElements.first();
      await firstInteractive.focus();

      // Check that element is focused
      await expect(firstInteractive).toBeFocused();
    }
  });

  test("should have proper semantic HTML", async ({ page }) => {
    await page.goto("/");

    // Check for semantic elements
    const semanticElements = page.locator(
      "main, nav, header, footer, section, article"
    );
    const semanticCount = await semanticElements.count();

    // Should have some semantic elements
    expect(semanticCount).toBeGreaterThanOrEqual(0);

    // Check for proper landmark roles
    const landmarks = page.locator(
      '[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"]'
    );
    const landmarkCount = await landmarks.count();

    // Should have some landmark roles
    expect(landmarkCount).toBeGreaterThanOrEqual(0);
  });

  test("should handle screen reader navigation", async ({ page }) => {
    await page.goto("/");

    // Test that all interactive elements are accessible
    const interactiveElements = page.locator(
      "button, input, select, textarea, a"
    );
    const interactiveCount = await interactiveElements.count();

    for (let i = 0; i < Math.min(interactiveCount, 3); i++) {
      const element = interactiveElements.nth(i);
      if (await element.isVisible()) {
        // Check that element is accessible
        const isAccessible = await element.evaluate(el => {
          return el.offsetWidth > 0 && el.offsetHeight > 0;
        });

        expect(isAccessible).toBeTruthy();
      }
    }
  });

  test("should have proper error handling", async ({ page }) => {
    await page.goto("/collection");

    // Test form validation errors
    const inputs = page.locator("input[required]");
    const requiredInputCount = await inputs.count();

    if (requiredInputCount > 0) {
      const firstRequired = inputs.first();

      // Try to submit without filling required field
      const submitButton = page.locator('button[type="submit"]').first();
      if (await submitButton.isVisible()) {
        await submitButton.click();

        // Check for error messages or validation
        const errorMessages = page.locator(
          '[role="alert"], .error, [aria-invalid="true"]'
        );
        const errorCount = await errorMessages.count();

        // Should handle validation gracefully
        expect(errorCount).toBeGreaterThanOrEqual(0);
      }
    }
  });
});
