import { mockRequest } from "../utils/mockRequest";
import { navigate } from "../utils/navigate";
import { removeContent } from "../utils/removeContent";
import { test, expect } from "../utils/test";

import fixtures from "./network.fixture.json";

test.describe("Network page", () => {

	test.beforeEach(async ({ page }) => {
		await page.route("**/*", (route, request) => {

			if (request.url().match("gs-stats-polkadot") && request.postDataJSON()?.query.match("currents")) {
				return route.fulfill({
					status: 200,
					body: JSON.stringify(fixtures.stats)
				});
			}

			route.continue();
		});
	});

	test("redirects to /:network", async ({ page, takeScreenshot }) => {
		await navigate(page, "/polkadot/latest-extrinsics", {waitUntil: "data-loaded"});
		await page.waitForURL(/\/polkadot/);
	});

	test("shows stats", async ({ page, takeScreenshot }) => {
		await navigate(page, "/polkadot", {waitUntil: "data-loaded"});

		const stats = page.getByTestId("network-stats");
		await takeScreenshot("network-stats", stats);
	});

	test("shows token distribution", async ({ page, takeScreenshot }) => {
		await navigate(page, "/polkadot", {waitUntil: "data-loaded"});

		const tokenDistribution = page.getByTestId("network-token-distribution");
		await takeScreenshot("network-stats", tokenDistribution);
	});

	test("shows latest extrinsics tab", async ({ page, takeScreenshot }) => {
		await navigate(page, "/polkadot", {waitUntil: "data-loaded"});

		await page.getByTestId("extrinsics-tab").click();

		await removeContent(page.locator("[data-test=extrinsics-table] tr td"));

		const relatedItems = page.getByTestId("network-related-items");
		await takeScreenshot("network-latest-extrinsics", relatedItems);
	});

	test("shows latest blocks tab", async ({ page, takeScreenshot }) => {
		await navigate(page, "/polkadot", {waitUntil: "data-loaded"});

		await page.getByTestId("blocks-tab").click();

		await removeContent(page.locator("[data-test=blocks-table] tr td"));

		const relatedItems = page.getByTestId("network-related-items");
		await takeScreenshot("network-latest-blocks", relatedItems);
	});

	test("shows latest transfers tab", async ({ page, takeScreenshot }) => {
		await navigate(page, "/polkadot", {waitUntil: "data-loaded"});

		await page.getByTestId("transfers-tab").click();

		await removeContent(page.locator("[data-test=transfers-table] tr td"));

		const relatedItems = page.getByTestId("network-related-items");
		await takeScreenshot("network-latest-transfers", relatedItems);
	});

	test("shows top holders tab", async ({ page, takeScreenshot }) => {
		await navigate(page, "/polkadot", {waitUntil: "data-loaded"});

		await page.getByTestId("top-holders-tab").click();

		await removeContent(page.locator("[data-test=balances-table] tr td"));

		const relatedItems = page.getByTestId("network-related-items");
		await takeScreenshot("network-top-holders", relatedItems);
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

		const relatedItems = page.getByTestId("network-related-items");
		await takeScreenshot("network-latest-extrinsics-error", relatedItems);
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

		const relatedItems = page.getByTestId("network-related-items");
		await takeScreenshot("network-latest-blocks-error", relatedItems);
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

		const relatedItems = page.getByTestId("network-related-items");
		await takeScreenshot("network-latest-transfers-error", relatedItems);
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

		const relatedItems = page.getByTestId("network-related-items");
		await takeScreenshot("network-top-holders-error", relatedItems);
	});
});

