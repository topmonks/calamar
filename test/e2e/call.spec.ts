import { test, expect } from "@playwright/test";

import { screenshot } from "../utils/screenshot";

test.describe("Call detail page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/kusama/call/0015163154-000002-44488");
		await page.waitForTimeout(2000); // TODO find out better waiting until page is loaded
	});

	test("shows call detail page", async ({ page }) => {
		await screenshot(page, "call");
	});
});
