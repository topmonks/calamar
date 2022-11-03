import { test, expect } from "@playwright/test";

import { screenshot } from "../utils/screenshot";

test.describe("Search results page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/equilibrium/search?query=Oracle.NewPrice");
		await page.waitForTimeout(1000); // TODO find out better waiting until page is loaded
	});

	test("shows search results page", async ({ page }) => {
		await page.waitForTimeout(1000); // TODO find out better waiting until page is loaded

		await page.locator("[data-test=events-table] tr").evaluateAll((rows) =>
			rows.forEach((row) => row.style.visibility = "hidden")
		);

		await page.waitForTimeout(1000); // TODO find out better waiting until page is loaded

		await page.locator("[data-test=events-table] tr").evaluateAll((rows) =>
			rows.forEach((row) => row.style.visibility = "hidden")
		);

		await screenshot(page, "searchResults");
	});
});