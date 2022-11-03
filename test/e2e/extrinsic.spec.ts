import { test, expect, selectors } from "@playwright/test";

import { screenshot } from "../utils/screenshot";

test.describe("Extrinsic detail page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/kusama/extrinsic/0014932897-000002-93378");
		await page.waitForTimeout(1000); // TODO find out better waiting until page is loaded
	});

	test("shows extrinsic detail page", async ({ page }) => {
		await screenshot(page, "extrinsicWithEvents");

		await page.getByText("calls").click(); // Yes, .locator() was not working for some weird reason, so I left it like this.

		await page.evaluate(() => { window.scroll(0,0); });

		await screenshot(page, "extrinsicWithCalls");
	});
});
