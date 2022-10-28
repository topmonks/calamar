import { test, expect } from "@playwright/test";

import { screenshot } from "../utils/screenshot";

test.describe("home page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");
	});

	test("shows home page", async ({ page }) => {
		const networkSelect = page.locator(".MuiSelect-select");
		await networkSelect.click();
		await page.locator(".MuiMenuItem-root", {hasText: /^Polkadot$/}).click();

		await screenshot(page, "home");
	});

	test("keeps last selected network after reload", async ({ page }) => {
		await page.waitForTimeout(5000);
		const networkSelect = page.locator(".MuiSelect-select");
		await networkSelect.click();

		await page.locator(".MuiMenuItem-root", {hasText: /^Polkadot$/}).click();
		await page.reload();

		await expect(networkSelect).toHaveText("Polkadot");
	});
});
