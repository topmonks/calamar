import { test, expect, selectors } from "@playwright/test";

import { screenshot } from "../utils/screenshot";

test.describe("Extrinsic detail page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/kusama/extrinsic/0014932897-000002-93378");
		await page.waitForTimeout(2000); // TODO find out better waiting until page is loaded
	});

	test("shows extrinsic detail page with events", async ({ page }) => {
		await screenshot(page, "extrinsicWithEvents");
	});


	test("shows extrinsic detail page with calls", async ({ page }) => {
		await page.locator("[data-test=calls-tab]").click();

		await page.evaluate(() => { window.scroll(0,0); });

		await screenshot(page, "extrinsicWithCalls");
	});
});
