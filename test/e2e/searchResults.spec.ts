import { test, expect } from "@playwright/test";

import { removeContent } from "../utils/removeContent";
import { screenshot } from "../utils/screenshot";

test.describe("Search results page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/equilibrium/search?query=Oracle.NewPrice");
		await page.waitForTimeout(2000); // TODO find out better waiting until page is loaded
	});

	test("shows search results page", async ({ page }) => {
		await removeContent(page.locator("[data-test=events-table] tr td"));
		await screenshot(page, "searchResults");
	});
});
