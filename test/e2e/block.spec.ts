import { test, expect } from "@playwright/test";

import { screenshot } from "../utils/screenshot";

test.describe("Block detail page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/kusama/block/0014932897-93378");
		await page.waitForTimeout(2000); // TODO find out better waiting until page is loaded
	});

	test("shows block detail page", async ({ page }) => {
		await screenshot(page, "block");
	});
});
