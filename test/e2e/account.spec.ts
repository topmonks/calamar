import { test, expect } from "@playwright/test";

import { getAccount } from "../../src/services/accountService";
import { getExtrinsics } from "../../src/services/extrinsicsService";

import { mockRequest } from "../utils/mockRequest";
import { removeContent } from "../utils/removeContent";
import { screenshot } from "../utils/screenshot";
import { waitForPageEvent } from "../utils/waitForPageEvent";

test.describe("Account detail page", () => {
	const address = "0x885f84242d71e6e44ddbe5345d5050a9c1b4dcc908cb2b84102a27035177fe22";

	test("shows account detail page with extrinsics", async ({ page }) => {
		await page.goto(`/kusama/account/${address}`);
		await waitForPageEvent(page, "data-loaded");

		await removeContent(page.locator("[data-test=extrinsics-table] tr td"));
		await screenshot(page, "accountWithExtrinsics");
	});

	test("shows error message when account data fetch fails", async ({ page }) => {
		mockRequest(

			page,
			() => getAccount("kusama", address),
			(route) => route.fulfill({
				status: 200,
				body: JSON.stringify({
					errors: [{
						message: "Account error"
					}]
				})
			})
		);

		await page.goto(`/kusama/account/${address}`);
		await waitForPageEvent(page, "data-loaded");

		const errorMessage = page.getByTestId("error");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(/Unexpected error/);
		await expect(errorMessage).toHaveText(/Account error/);

		await screenshot(page, "accountError");
	});

	test("shows error message when extrinsics items fetch fails", async ({ page }) => {
		mockRequest(
			page,
			() => getExtrinsics("kusama", 10, 0, {
				OR: [
					{ signature_jsonContains: `{"address": "${address}" }` },
					{ signature_jsonContains: `{"address": { "value": "${address}"} }` },
				]
			}),
			(route) => route.fulfill({
				status: 200,
				body: JSON.stringify({
					errors: [{
						message: "Extrinsics error"
					}]
				})
			})
		);

		await page.goto(`/kusama/account/${address}`);
		await waitForPageEvent(page, "data-loaded");

		const errorMessage = page.getByTestId("error");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(/Unexpected error/);
		await expect(errorMessage).toHaveText(/Extrinsics error/);

		await screenshot(page, "accountWithExtrinsicsError");
	});
});
