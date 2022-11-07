import { test, expect } from "@playwright/test";

import { screenshot } from "../utils/screenshot";

test.describe("Not found page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/xx");
		await page.waitForTimeout(2000); // TODO find out better waiting until page is loaded
	});

	test("shows not found page", async ({ page }) => {
		await screenshot(page, "notFound");
	});
});
