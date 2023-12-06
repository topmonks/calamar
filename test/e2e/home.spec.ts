import { navigate } from "../utils/navigate";
import { test, expect } from "../test";

test.describe("home page", () => {
	test("shows home page", async ({ page, takeScreenshot }) => {
		await navigate(page, "/", {waitUntil: "load"});

		const $searchInput = page.getByTestId("search-input");
		const $networks = page.getByTestId("networks");

		await expect($searchInput).toBeVisible();
		await expect($networks).toBeVisible();

		await takeScreenshot("home");
	});
});
