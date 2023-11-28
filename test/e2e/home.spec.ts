import { navigate } from "../utils/navigate";
import { test, expect } from "../test";

test.describe("home page", () => {
	test("shows home page", async ({ page, takeScreenshot }) => {
		await navigate(page, "/", {waitUntil: "load"});

		await takeScreenshot("home");
	});
});
