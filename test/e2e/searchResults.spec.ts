import { test, expect } from "@playwright/test";

import { removeContent } from "../utils/removeContent";
import { screenshot } from "../utils/screenshot";
import { waitForPageEvent } from "../utils/waitForPageEvent";

test.describe("Search results page", () => {
	test("shows search results page", async ({ page }) => {
		await page.goto("/equilibrium/search?query=Oracle.NewPrice");
		await waitForPageEvent(page, "data-loaded");

		await removeContent(page.locator("[data-test=events-table] tr td"));
		await screenshot(page, "searchResults");
	});


});
