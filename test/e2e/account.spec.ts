import { mockRequest } from "../utils/mockRequest";
import { navigate } from "../utils/navigate";
import { removeContent } from "../utils/removeContent";
import { test, expect } from "../utils/test";

test.describe("Account detail page", () => {
	const address = "0x885f84242d71e6e44ddbe5345d5050a9c1b4dcc908cb2b84102a27035177fe22";

	test("shows account detail page with extrinsics", async ({ page, takeScreenshot }) => {
		await navigate(page, `/kusama/account/${address}`, {waitUntil: "data-loaded"});

		await removeContent(page.locator("[data-test=extrinsics-table] tr td"));
		await takeScreenshot("account-with-extrinsics");
	});

	test("shows not found message if account was not found", async ({ page, takeScreenshot }) => {
		const id = "0x123456789";

		await navigate(page, `/kusama/account/${id}`, {waitUntil: "data-loaded"});

		const errorMessage = page.getByTestId("not-found");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText("Account doesn't exist or haven't signed any extrinsic");

		await takeScreenshot("account-not-found");
	});

	test("shows error message when extrinsics items fetch fails", async ({ page, takeScreenshot }) => {
		mockRequest(
			page,
			(request) => request.postData()?.match("extrinsics"),
			(route) => route.fulfill({
				status: 200,
				body: JSON.stringify({
					errors: [{
						message: "Extrinsics error"
					}]
				})
			})
		);

		await navigate(page, `/kusama/account/${address}`, {waitUntil: "data-loaded"});

		const errorMessage = page.getByTestId("error");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(/Unexpected error/);
		await expect(errorMessage).toHaveText(/Extrinsics error/);

		await takeScreenshot("account-with-extrinsics-error");
	});
});
