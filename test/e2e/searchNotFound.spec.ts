import { test, expect } from "@playwright/test";

import { navigate } from "../utils/navigate";
import { screenshot } from "../utils/screenshot";

test.describe("Search not found page", () => {
	test.beforeEach(async ({ page }) => {
		await navigate(page, "/equilibrium/search?query=ss");
		await page.waitForTimeout(2000); // TODO find out better waiting until page is loaded
	});

	test("shows search not found page", async ({ page }) => {
		await screenshot(page, "searchNotFound");
	});
});
