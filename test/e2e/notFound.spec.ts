import { test, expect } from "@playwright/test";

import { screenshot } from "../utils/screenshot";

test.describe("Not found page", () => {
	test("shows not found page", async ({ page }) => {
		await page.goto("/xx");
		await screenshot(page, "notFound");
	});
});
