import { test, expect } from "@playwright/test";

import { getExtrinsicsWithoutTotalCount } from "../../src/services/extrinsicsService";

import { mockRequest } from "../utils/mockRequest";
import { navigate } from "../utils/navigate";
import { removeContent } from "../utils/removeContent";
import { screenshot } from "../utils/screenshot";

test.describe("Latest extrinsics page", () => {
	test("shows latest extrinsics page", async ({ page }) => {
		await navigate(page, "/polkadot/latest-extrinsics", {waitUntil: "data-loaded"});

		await removeContent(page.locator("[data-test=extrinsics-table] tr td"));
		await screenshot(page, "latestExtrinsics");
	});

	test("show error message when extrinsics items fetch fails", async ({ page }) => {
		mockRequest(
			page,
			() => getExtrinsicsWithoutTotalCount("polkadot", 10, 0, undefined, "id_DESC"),
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

		await screenshot(page, "latestExtrinsicsError");
	});
});
