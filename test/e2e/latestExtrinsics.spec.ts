import { getExtrinsicsWithoutTotalCount } from "../../src/services/extrinsicsService";

import { mockRequest } from "../utils/mockRequest";
import { navigate } from "../utils/navigate";
import { removeContent } from "../utils/removeContent";
import { test, expect } from "../utils/test";


test.describe("Latest extrinsics page", () => {

	test("redirects to /:network", async ({ page, takeScreenshot }) => {
		await navigate(page, "/kusama/latest-extrinsics", {waitUntil: "data-loaded"});
		await page.waitForURL(/\/kusama/);
	});

	test("shows latest extrinsics page", async ({ page, takeScreenshot }) => {
		await navigate(page, "/polkadot/latest-extrinsics", {waitUntil: "data-loaded"});

		await removeContent(page.locator("[data-test=extrinsics-table] tr td"));
		await takeScreenshot("latest-extrinsics");
	});

	test("show error message when extrinsics items fetch fails", async ({ page, takeScreenshot }) => {
		mockRequest(
			page,
			() => getExtrinsicsWithoutTotalCount("polkadot", undefined, "id_DESC", {offset: 0, limit: 10}),
			(route) => route.fulfill({
				status: 200,
				body: JSON.stringify({
					errors: [{
						message: "Extrinsics error"
					}]
				})
			})
		);

		await navigate(page, "/polkadot/latest-extrinsics", {waitUntil: "data-loaded"});

		const errorMessage = page.getByTestId("error");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(/Unexpected error/);
		await expect(errorMessage).toHaveText(/Extrinsics error/);

		await takeScreenshot("latest-extrinsics-error");
	});
});
