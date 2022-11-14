import { test, expect } from "@playwright/test";

import { navigate } from "../utils/navigate";
import { screenshot } from "../utils/screenshot";

test.describe("home page", () => {
	test("shows home page", async ({ page }) => {
		await navigate(page, "/", {waitUntil: "load"});

		const networkSelect = page.locator(".MuiSelect-select");
		await networkSelect.click();
		await page.locator(".MuiMenuItem-root", {hasText: /^Polkadot$/}).click();

		await screenshot(page, "home");
	});

	test("keeps last selected network after reload", async ({ page }) => {
		await navigate(page, "/", {waitUntil: "load"});

		const networkSelect = page.locator(".MuiSelect-select");
		await networkSelect.click();

		await page.locator(".MuiMenuItem-root", {hasText: /^Polkadot$/}).click();
		await page.reload();

		await expect(networkSelect).toHaveText("Polkadot");
	});
});
