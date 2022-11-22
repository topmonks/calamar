import { navigate } from "../utils/navigate";
import { test, expect } from "../utils/test";

test.describe("home page", () => {
	test("shows home page", async ({ page, takeScreenshot }) => {
		await navigate(page, "/", {waitUntil: "load"});

		const networkSelect = page.locator(".MuiSelect-select");
		await networkSelect.click();
		await page.locator(".MuiMenuItem-root", {hasText: /^Polkadot$/}).click();

		await takeScreenshot("home");
	});

	test("keeps last selected network after reload", async ({ page, takeScreenshot }) => {
		await navigate(page, "/", {waitUntil: "load"});

		const networkSelect = page.locator(".MuiSelect-select");
		await networkSelect.click();

		await page.locator(".MuiMenuItem-root", {hasText: /^Polkadot$/}).click();
		await page.reload();

		await expect(networkSelect).toHaveText("Polkadot");
	});
});
