import { test, expect } from "@playwright/test";

import { screenshot } from "../utils/screenshot";

test.describe("Latest extrinsics page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/polkadot/latest-extrinsics");
		await page.waitForTimeout(1000); // TODO find out better waiting until page is loaded
	});

	test("shows latest extrinsics page", async ({ page }) => {
		await page.locator("[data-test=extrinsics-info-table] tr").evaluateAll((rows) =>
			rows.forEach((row) => row.style.visibility = "hidden")
		);

		await screenshot(page, "latestExtrinsics");
	});
});
