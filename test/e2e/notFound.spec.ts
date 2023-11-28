import { navigate } from "../utils/navigate";

import { test, expect } from "../test";

test.describe("Not found page", () => {
	test("shows not found page", async ({ page, takeScreenshot }) => {
		await navigate(page, "/xx", {waitUntil: "load"});
		await takeScreenshot("not-found");
	});
});
