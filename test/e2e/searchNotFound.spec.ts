import { test, expect } from "@playwright/test";

import { screenshot } from "../utils/screenshot";

test.describe("Search not found page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/equilibrium/search?query=ss");
		await page.waitForTimeout(2000); // TODO find out better waiting until page is loaded
	});

	test("shows search not found page", async ({ page }) => {
		await screenshot(page, "searchNotFound");
	});
});
