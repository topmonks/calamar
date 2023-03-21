import { getNetwork } from "../../src/services/networksService";

import { mockRequest } from "../utils/mockRequest";
import { navigate } from "../utils/navigate";
import { removeContent } from "../utils/removeContent";
import { test, expect } from "../utils/test";

import fixtures from "./account.fixture.json";

test.describe("Account detail page", () => {
	const address = "0xa69484f2b10ec2f1dea19394423d576f91c6b5ab2315b389f4e108bcf0aa2840";

	test("shows account detail page with balances", async ({ page, takeScreenshot }) => {
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

		await page.route("https://api.coingecko.com/api/v3/simple/price", (route, request) => {
			route.fulfill({
				status: 200,
				body: JSON.stringify(fixtures.usdRates)
			});
		});

		await navigate(page, `/kusama/account/${address}`, {waitUntil: "data-loaded"});

		await page.getByTestId("balances-tab").click();

		for (const balanceFixture of fixtures.balances) {
			const network = getNetwork(balanceFixture.network)!;

			if (balanceFixture.response.data) {
				for (const type of ["total", "free", "reserved"]) {
					const balance = page.getByTestId(`${balanceFixture.network}-balance-${type}`);
					await expect(balance).toBeVisible();
					await expect(balance).toContainText(balanceFixture.display?.[type]);
					// TODO USD values
				}
			}

			if (balanceFixture.response.errors) {
				const errorMessage = page.getByTestId(`${network.name}-balance-error`);
				await expect(errorMessage).toBeVisible();
				await expect(errorMessage).toHaveText(/Unexpected error/);
				await expect(errorMessage).toHaveText(/Kusama balance error/);
			}
		}

		await takeScreenshot("account-with-balances");
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
