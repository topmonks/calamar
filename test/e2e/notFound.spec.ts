import { test, expect } from "@playwright/test";

import { navigate } from "../utils/navigate";
import { screenshot } from "../utils/screenshot";

test.describe("Not found page", () => {
	test("shows not found page", async ({ page }) => {
		await navigate(page, "/xx", {waitUntil: "load"});
		await screenshot(page, "notFound");
	});
});
