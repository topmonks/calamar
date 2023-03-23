import { clearCapturedPageEvents, waitForPageEvent } from "../utils/events";
import { mockRequest } from "../utils/mockRequest";
import { navigate } from "../utils/navigate";
import { removeContent } from "../utils/removeContent";
import { test, expect } from "../utils/test";

import fixtures from "./account.fixture.json";

test.describe("Account detail page", () => {
	const address = "0xa69484f2b10ec2f1dea19394423d576f91c6b5ab2315b389f4e108bcf0aa2840";

	// mock balances
	test.beforeEach(async ({ page }) => {
		await page.route("**/*", (route, request) => {
			for (const balanceFixture of fixtures.balances) {
				if (request.url().match(`${balanceFixture.network}-balances`)) {
					return route.fulfill({
						status: 200,
						body: JSON.stringify(balanceFixture.response)
					});
				}
			}

			route.continue();
		});

		await page.route("https://api.coingecko.com/api/v3/simple/price?*", (route, request) => {
			route.fulfill({
				status: 200,
				body: JSON.stringify(fixtures.usdRates)
			});
		});
	});

	test("shows account balance info", async ({ page, takeScreenshot }) => {
		await navigate(page, `/kusama/account/${address}`, {waitUntil: "data-loaded"});

		const info = page.getByTestId("account-info");

		// TODO check data

		await takeScreenshot("account-info", info);
	});

	test("shows account balance portfolio", async ({ page, takeScreenshot }) => {
		await navigate(page, `/kusama/account/${address}`, {waitUntil: "data-loaded"});

		for (const type of ["total", "free", "reserved"]) {
			const balance = page.getByTestId(`porfolio-${type}`);
			await expect(balance).toBeVisible();
			await expect(balance).toContainText(fixtures.portfolio.display[type]);
		}

		const portfolio = page.getByTestId("account-portfolio");

		// check chart by network
		await expect(page.getByTestId("account-portfolio-chart-by_network")).toBeVisible();
		await waitForPageEvent(page, "chart-finished", (event: any) => {
			return event.detail.containerRef?.getAttribute("data-test") === "account-portfolio-chart-by_network";
		});

		await takeScreenshot("account-porfolio-by-network", portfolio);

		// check chart by type
		clearCapturedPageEvents(page, ["chart-finished"]);
		await portfolio.locator("button[value=BY_TYPE]").click(),

		await expect(page.getByTestId("account-portfolio-chart-by_type")).toBeVisible();
		await waitForPageEvent(page, "chart-finished", (event: any) => {
			return event.detail.containerRef?.getAttribute("data-test") === "account-portfolio-chart-by_type";
		});

		await takeScreenshot("account-porfolio-by-type", portfolio);
	});

	test("shows portfolio not found message if no account balances found", async ({ page, takeScreenshot }) => {
		await page.route("**/*", (route, request) => {
			if (request.url().match(/[a-z]+-balances/)) {
				return route.fulfill({
					status: 200,
					body: JSON.stringify({
						data: {
							balance: null
						}
					})
				});
			}

			route.fallback();
		});

		await navigate(page, `/kusama/account/${address}`, {waitUntil: "data-loaded"});

		const portfolio = page.getByTestId("account-portfolio");

		const notFoundMessage = portfolio.getByTestId("not-found");
		await expect(notFoundMessage).toBeVisible();
		await expect(notFoundMessage).toHaveText("No positive balances with conversion rate to USD found");

		await takeScreenshot("account-porfolio-not-found", portfolio);
	});

	test("shows account balances", async ({ page, takeScreenshot }) => {
		await navigate(page, `/kusama/account/${address}`, {waitUntil: "data-loaded"});

		await page.getByTestId("balances-tab").click();

		for (const balanceFixture of fixtures.balances) {
			if (balanceFixture.response.data) {
				for (const type of ["total", "free", "reserved"]) {
					const balance = page.getByTestId(`${balanceFixture.network}-balance-${type}`);
					await expect(balance).toBeVisible();
					for (const display of balanceFixture.display?.[type] || []) {
						await expect(balance).toContainText(display);
					}
				}
			}
		}

		await takeScreenshot("account-balances", page.getByTestId("account-related-items"));
	});

	test("shows error message if account balances fetch fails", async ({ page, takeScreenshot }) => {
		await page.route("**/*", (route, request) => {
			if (request.url().match("kusama-balances")) {
				return route.fulfill({
					status: 200,
					body: JSON.stringify({
						errors: [{
							message: "Kusama balance error"
						}]
					})
				});
			}

			route.fallback();
		});

		await navigate(page, `/kusama/account/${address}`, {waitUntil: "data-loaded"});

		await page.getByTestId("balances-tab").click();

		for (const balanceFixture of fixtures.balances) {
			if (balanceFixture.network === "kusama") {
				const errorMessage = page.getByTestId("kusama-balance-error");
				await expect(errorMessage).toBeVisible();
				await expect(errorMessage).toHaveText(/Unexpected error/);
				await expect(errorMessage).toHaveText(/Kusama balance error/);
			} else if (balanceFixture.response.data) {
				for (const type of ["total", "free", "reserved"]) {
					const balance = page.getByTestId(`${balanceFixture.network}-balance-${type}`);
					await expect(balance).toBeVisible();
					for (const display of balanceFixture.display?.[type] || []) {
						await expect(balance).toContainText(display);
					}
				}
			}
		}

		await takeScreenshot("account-balances-with-error", page.getByTestId("account-related-items"));
	});

	test("shows account detail page with extrinsics", async ({ page, takeScreenshot }) => {
		await navigate(page, `/kusama/account/${address}`, {waitUntil: "data-loaded"});

		await page.getByTestId("extrinsics-tab").click();

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

	test("shows error message if account address is not valid", async ({ page, takeScreenshot }) => {
		const id = "0x123456789";

		await page.route("**/*", (route, request) => {
			if (request.url().match(/[a-z]+-balances/)) {
				return route.fulfill({
					status: 200,
					body: JSON.stringify({
						data: {
							balance: null
						}
					})
				});
			}

			route.fallback();
		});

		await navigate(page, `/kusama/account/${id}`, {waitUntil: "data-loaded"});

		const errorMessage = page.getByTestId("error");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(/Unexpected error/);
		await expect(errorMessage).toHaveText(/Invalid account address/);

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

		await page.getByTestId("extrinsics-tab").click();

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
