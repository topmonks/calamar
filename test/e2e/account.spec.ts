import { test, expect } from "@playwright/test";

import { screenshot } from "../utils/screenshot";

test.describe("Account detail page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/kusama/account/0x885f84242d71e6e44ddbe5345d5050a9c1b4dcc908cb2b84102a27035177fe22");
		await page.waitForTimeout(1000); // TODO find out better waiting until page is loaded
	});

	test("shows account detail page", async ({ page }) => {
		await page.locator("[data-test=extrinsics-table] tr").evaluateAll((rows) =>
			rows.forEach((row) => row.style.visibility = "hidden")
		);

		await screenshot(page, "account");
	});
});
