import { mockRequest } from "../utils/mockRequest";
import { navigate } from "../utils/navigate";
import { removeContent } from "../utils/removeContent";
import { test, expect } from "../utils/test";


test.describe("Chain dashboard page", () => {

	test("redirects to /:network", async ({ page, takeScreenshot }) => {
		await navigate(page, "/kusama/latest-extrinsics", {waitUntil: "data-loaded"});
		await page.waitForURL(/\/kusama/);
	});

	test("shows latest extrinsics tab", async ({ page, takeScreenshot }) => {
		await navigate(page, "/polkadot", {waitUntil: "data-loaded"});

		await page.getByTestId("extrinsics-tab").click();
        
		await removeContent(page.locator("[data-test=extrinsics-table] tr td"));
		await takeScreenshot("chain-dashboard-latest-extrinsics");
	});

	test("shows latest blocks tab", async ({ page, takeScreenshot }) => {
		await navigate(page, "/polkadot", {waitUntil: "data-loaded"});

		await page.getByTestId("blocks-tab").click();

		await removeContent(page.locator("[data-test=blocks-table] tr td"));
		await takeScreenshot("chain-dashboard-latest-blocks");
	});

	test("shows latest transfers tab", async ({ page, takeScreenshot }) => {
		await navigate(page, "/polkadot", {waitUntil: "data-loaded"});

		await page.getByTestId("transfers-tab").click();

		await removeContent(page.locator("[data-test=transfers-table] tr td"));
		await takeScreenshot("chain-dashboard-latest-transfers");
	});

	test("shows top holders tab", async ({ page, takeScreenshot }) => {
		await navigate(page, "/polkadot", {waitUntil: "data-loaded"});

		await page.getByTestId("top-holders-tab").click();

		await removeContent(page.locator("[data-test=balances-table] tr td"));
		await takeScreenshot("chain-dashboard-top-holders");
	});

	test("show error message when extrinsics items fetch fails", async ({ page, takeScreenshot }) => {
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

		await navigate(page, "/polkadot", {waitUntil: "data-loaded"});

		const errorMessage = page.getByTestId("error");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(/Unexpected error/);
		await expect(errorMessage).toHaveText(/Extrinsics error/);

		await takeScreenshot("chain-dashboard-latest-extrinsics-error");
	});

	test("show error message when blocks items fetch fails", async ({ page, takeScreenshot }) => {
		mockRequest(
			page,
			(request) => request.postData()?.match("blocks"),
			(route) => route.fulfill({
				status: 200,
				body: JSON.stringify({
					errors: [{
						message: "Blocks error"
					}]
				})
			})
		);

		await navigate(page, "/polkadot", {waitUntil: "data-loaded"});

		await page.getByTestId("blocks-tab").click();
        
		const errorMessage = page.getByTestId("error");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(/Unexpected error/);
		await expect(errorMessage).toHaveText(/Blocks error/);

		await takeScreenshot("chain-dashboard-latest-blocks-error");
	});

	test("show error message when transfers items fetch fails", async ({ page, takeScreenshot }) => {
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

		await navigate(page, "/polkadot", {waitUntil: "data-loaded"});

		await page.getByTestId("transfers-tab").click();
        
		const errorMessage = page.getByTestId("error");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(/Unexpected error/);
		await expect(errorMessage).toHaveText(/Transfers error/);

		await takeScreenshot("chain-dashboard-latest-transfers-error");
	});

	test("show error message when top holders items fetch fails", async ({ page, takeScreenshot }) => {
		mockRequest(
			page,
			(request) => request.postData()?.match("accounts"),
			(route) => route.fulfill({
				status: 200,
				body: JSON.stringify({
					errors: [{
						message: "Top holders error"
					}]
				})
			})
		);

		await navigate(page, "/polkadot", {waitUntil: "data-loaded"});

		await page.getByTestId("top-holders-tab").click();
        
		const errorMessage = page.getByTestId("error");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(/Unexpected error/);
		await expect(errorMessage).toHaveText(/Top holders error/);

		await takeScreenshot("chain-dashboard-top-holders-error");
	});
});

