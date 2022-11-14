import { test, expect } from "@playwright/test";

import { navigate } from "../utils/navigate";
import { removeContent } from "../utils/removeContent";
import { screenshot } from "../utils/screenshot";

test.describe("Search results page", () => {
	test("redirects to extrinsic if found by hash", async ({ page }) => {
		await navigate(page, "/equilibrium/search?query=0x162bd24c5f19b9fee4a33d11c2908d73d5b0d6c428cf0f1eecdf568c346b26b3", {waitUntil: "data-loaded"});
		await page.waitForURL(/\/equilibrium\/extrinsic\/0001116746-000033-e9bc2/);
	});

	test("redirects to block if found by hash", async ({ page }) => {
		await navigate(page, "/equilibrium/search?query=0xe9bc2f7f23685d545bfcb71ea59140700f83868300123fcb04f4872b18979242", {waitUntil: "data-loaded"});
		await page.waitForURL(/\/equilibrium\/block\/0001116746-e9bc2/);
	});

	test("redirects to block if found by height", async ({ page }) => {
		await navigate(page, "/equilibrium/search?query=1116746", {waitUntil: "data-loaded"});
		await page.waitForURL(/\/equilibrium\/block\/0001116746-e9bc2/);
	});

	test("redirects to account if found by raw address", async ({ page }) => {
		await navigate(page, "/equilibrium/search?query=0x84f4045c97be387e116aad02946aa3972e06a169847cf15532a182c075818b6f", {waitUntil: "data-loaded"});
		await page.waitForURL(/\/equilibrium\/account\/0x84f4045c97be387e116aad02946aa3972e06a169847cf15532a182c075818b6f/);
	});

	test("redirects to account if found by encoded address", async ({ page }) => {
		await navigate(page, "/equilibrium/search?query=cg67PjybUeaEXyDzybvVDj6zeojYfDQGFK5YBK5HJn55MmQZG", {waitUntil: "data-loaded"});
		await page.waitForURL(/\/equilibrium\/account\/0x84f4045c97be387e116aad02946aa3972e06a169847cf15532a182c075818b6f/);
	});


	test("shows search results page", async ({ page }) => {
		await navigate(page, "/equilibrium/search?query=Oracle.NewPrice", {waitUntil: "data-loaded"});

		await removeContent(page.locator("[data-test=events-table] tr td"));
		await screenshot(page, "searchResults");
	});

	test("show not found message if nothing was found by hash", async ({ page }) => {
		const query = "0x1234567890";

		await navigate(page, `/equilibrium/search?query=${query}`, {waitUntil: "data-loaded"});

		const errorMessage = page.getByTestId("not-found");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(`Nothing was found for query ${query}`);
	});

	test("show not found message if nothing was found by height", async ({ page }) => {
		const query = "999999999";

		await navigate(page, `/equilibrium/search?query=${query}`, {waitUntil: "data-loaded"});

		const errorMessage = page.getByTestId("not-found");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(`Nothing was found for query ${query}`);
	});

	test("show not found message if nothing was found by name", async ({ page }) => {
		const query = "dflkasdjf";

		await navigate(page, `/equilibrium/search?query=${query}`, {waitUntil: "data-loaded"});

		const errorMessage = page.getByTestId("not-found");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(`Nothing was found for query ${query}`);
	});
});
