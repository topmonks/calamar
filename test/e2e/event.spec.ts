import { test, expect } from "@playwright/test";

import { screenshot } from "../utils/screenshot";

test.describe("Event detail page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/kusama/event/0015163154-000040-44488");
		await page.waitForTimeout(1000); // TODO find out better waiting until page is loaded
	});

	test("shows event detail page", async ({ page }) => {
		await screenshot(page, "event");
	});
});
