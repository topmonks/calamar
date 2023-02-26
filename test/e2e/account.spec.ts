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

	test("shows account detail page with calls", async ({ page, takeScreenshot }) => {
		await navigate(page, `/kusama/account/${address}`, {waitUntil: "data-loaded"});

		await page.getByTestId("calls-tab").click();

		await removeContent(page.locator("[data-test=calls-table] tr td"));
		await takeScreenshot("account-with-calls");
	});

	test("shows account detail page with transfers", async ({ page, takeScreenshot }) => {
		await navigate(page, `/kusama/account/${address}`, {waitUntil: "data-loaded"});

		await page.getByTestId("transfers-tab").click();

		await removeContent(page.locator("[data-test=transfers-table] tr td"));
		await takeScreenshot("account-with-transfers");
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

	test("shows error message when calls items fetch fails", async ({ page, takeScreenshot }) => {
		mockRequest(
			page,
			(request) => request.postData()?.match("calls"),
			(route) => route.fulfill({
				status: 200,
				body: JSON.stringify({
					errors: [{
						message: "Calls error"
					}]
				})
			})
		);

		await navigate(page, `/kusama/account/${address}`, {waitUntil: "data-loaded"});

		await page.getByTestId("calls-tab").click();
		
		const errorMessage = page.getByTestId("error");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(/Unexpected error/);
		await expect(errorMessage).toHaveText(/Calls error/);

		await takeScreenshot("account-with-calls-error");
	});

	test("shows error message when transfers items fetch fails", async ({ page, takeScreenshot }) => {
		mockRequest(
			page,
			(request) => request.postData()?.match("transfers"),
			(route) => route.fulfill({
				status: 200,
				body: JSON.stringify({
					errors: [{
						message: "Transfers error"
					}]
				})
			})
		);

		await navigate(page, `/kusama/account/${address}`, {waitUntil: "data-loaded"});

		await page.getByTestId("transfers-tab").click();
		
		const errorMessage = page.getByTestId("error");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(/Unexpected error/);
		await expect(errorMessage).toHaveText(/Transfers error/);

		await takeScreenshot("account-with-transfers-error");
	});
});
