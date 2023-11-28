import { Locator } from "@playwright/test";

import { clearCapturedPageEvents, waitForPageEvent } from "../utils/events";
import { getTableData } from "../utils/getTableData";
import { matchSquidRequest } from "../utils/matchSquidRequest";
import { navigate } from "../utils/navigate";
import { useDataFixture } from "../utils/useDataFixture";
import { useRequestFixture } from "../utils/useRequestFixture";

import { expect, test } from "../test";

import { TestItem } from "./templates/model";
import { testItemInfo } from "./templates/testItemInfo";
import { testItemError } from "./templates/testItemError";
import { testRelatedItems } from "./templates/testRelatedItems";
import { testRelatedItemsError } from "./templates/testRelatedItemsError";
import { mockRequestsWithFixture } from "./templates/utils";

test.describe("Account detail page", () => {
	const url = "/kusama/account/GLjawuGpmgzma4JkR4A56esGofJVKXWdDAuGeF6o5D66wGE";

	const account: TestItem = {
		name: "account",
		requests: [{
			queryProp: "identity",
			squidType: "gs-main",
			variables: {
				id: "GLjawuGpmgzma4JkR4A56esGofJVKXWdDAuGeF6o5D66wGE",
			},
			dataType: "item"
		}],
	};

	const relatedBalances: TestItem = {
		name: "balance",
		requests: [{
			queryProp: "balance",
			squidType: "gs-stats",
			dataType: "item"
		}]
	};

	const relatedExtrinsics: TestItem = {
		name: "extrinsic",
		requests: [{
			queryProp: "extrinsicsConnection",
			squidType: "gs-explorer",
			dataType: "itemsConnection"
		}]
	};

	const relatedCalls: TestItem = {
		name: "call",
		requests: [{
			queryProp: "callsConnection",
			squidType: "gs-explorer",
			dataType: "itemsConnection"
		}]
	};

	const relatedTransfers: TestItem = {
		name: "transfer",
		requests: [{
			queryProp: "transfersConnection",
			squidType: "gs-main",
			dataType: "itemsConnection"
		}]
	};

	mockRequestsWithFixture(account, [
		relatedBalances,
		relatedExtrinsics,
		relatedCalls,
		relatedTransfers
	]);

	test.beforeEach(async ({ page }) => {
		await page.route("https://api.coingecko.com/api/v3/simple/price?*", async (route, request) => {
			route.fulfill(await useRequestFixture("usd-rates-request", route));
		});
	});

	testItemInfo(url, account);
	testItemError(url, account);

	testRelatedItems(url, account, relatedBalances);

	testRelatedItems(url, account, relatedExtrinsics);
	testRelatedItemsError(url, account, relatedExtrinsics, relatedExtrinsics.requests);

	testRelatedItems(url, account, relatedCalls);
	testRelatedItemsError(url, account, relatedCalls, relatedCalls.requests);

	testRelatedItems(url, account, relatedTransfers);
	testRelatedItemsError(url, account, relatedTransfers, relatedTransfers.requests);

	test("show account identity info", async ({ page, takeScreenshot }) => {
		await navigate(page, "/kusama/account/EMRpBNnfAqRb62b14cxmnCdihtUjEeyh6tfyhGwnGwxjY8F");

		const $info = page.getByTestId("item-info");
		const $header = $info.getByTestId("item-header");
		const $identityInfo = $info.getByTestId("account-identity-info");

		await expect($header).toHaveText(
			await useDataFixture("account-identity-data", "header", $header)
		);

		const getIdentityInfoData = async (locator: Locator) => await locator.locator("> div").allInnerTexts();

		await expect(async () => {
			const identityInfoData = await getIdentityInfoData($identityInfo);
			expect(identityInfoData).toEqual(
				await useDataFixture(
					"account-identity-data",
					"identityInfo",
					$identityInfo,
					getIdentityInfoData
				)
			);
		}).toPass({timeout: 5000});

		await takeScreenshot("account-identity-info", $info);
	});

	test("shows error message if account address is not valid", async ({ page, takeScreenshot }) => {
		const id = "0x123456789";

		await navigate(page, `/kusama/account/${id}`);

		const $info = page.getByTestId("item-info");
		const $header = $info.getByTestId("item-header");
		const $error = $info.getByTestId("error");

		await expect($header).toHaveText(
			await useDataFixture("account-info-data", "invalidAddressHeader", $header)
		);

		await expect($error).toHaveText(
			await useDataFixture("account-info-data", "invalidAddressError", $error)
		);

		await takeScreenshot("account-invlid-address-error", $info);
	});

	test("shows account balance portfolio", async ({ page, takeScreenshot }) => {
		await navigate(page, url);

		const $portfolio = page.getByTestId("account-portfolio");

		for (const type of ["total", "free", "reserved"]) {
			const $balance = $portfolio.getByTestId(`porfolio-${type}`);
			await expect($balance).toBeVisible();
			await expect($balance).toContainText(
				await useDataFixture("account-portfolio-data", type, $balance)
			);
		}

		// check chart by network
		await expect($portfolio.getByTestId("account-portfolio-chart-by_network")).toBeVisible();
		await waitForPageEvent(page, "chart-finished", (event: any) => {
			return event.detail.containerRef?.getAttribute("data-test") === "account-portfolio-chart-by_network";
		});

		await takeScreenshot("account-porfolio-by-network", $portfolio);

		// check chart by type
		clearCapturedPageEvents(page, ["chart-finished"]);
		await $portfolio.locator("button[value=BY_TYPE]").click(),

		await expect($portfolio.getByTestId("account-portfolio-chart-by_type")).toBeVisible();
		await waitForPageEvent(page, "chart-finished", (event: any) => {
			return event.detail.containerRef?.getAttribute("data-test") === "account-portfolio-chart-by_type";
		});

		await takeScreenshot("account-porfolio-by-type", $portfolio);
	});

	test("shows portfolio not found message if no account balances found", async ({ page, takeScreenshot }) => {
		await page.route("**/*", (route) => {
			if (matchSquidRequest(route.request(), {
				squidType: "gs-stats",
				queryProp: "balance"
			})) {
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

		await navigate(page, url);

		const $portfolio = page.getByTestId("account-portfolio");

		const $notFoundMessage = $portfolio.getByTestId("not-found");
		await expect($notFoundMessage).toBeVisible();
		await expect($notFoundMessage).toHaveText(await useDataFixture("account-portfolio-data", "notFound", $notFoundMessage));

		await takeScreenshot("account-porfolio-not-found", $portfolio);
	});

	test("shows error message if account balances fetch fails", async ({ page, takeScreenshot }) => {
		await page.route("**/*", (route) => {
			if (matchSquidRequest(route.request(), {
				squidType: "gs-stats",
				network: "kusama",
				queryProp: "balance",
			})) {
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

		await navigate(page, url);

		const $relatedItems = page.getByTestId("related-items");
		const $relatedItemTypeTab = $relatedItems.getByTestId("balances-tab");
		const $relatedItemTypeTable = $relatedItems.getByTestId("balances-items").locator("table").first();

		await $relatedItemTypeTab.click();

		await expect($relatedItemTypeTable).toHaveTableData(
			await useDataFixture(
				"account-balances-data",
				"itemsTableWithError",
				$relatedItemTypeTable,
				getTableData
			)
		);

		await takeScreenshot("account-balances-with-error", $relatedItems);
	});
});
