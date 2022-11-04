import { test, expect } from "@playwright/test";

import { removeContent } from "../utils/removeContent";
import { screenshot } from "../utils/screenshot";

test.describe("Latest extrinsics page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/polkadot/latest-extrinsics");
		await page.waitForTimeout(2000); // TODO find out better waiting until page is loaded
	});

	test("shows latest extrinsics page", async ({ page }) => {
		await removeContent(page.locator("[data-test=extrinsics-table] tr td"));
		await screenshot(page, "latestExtrinsics");
	});
});
