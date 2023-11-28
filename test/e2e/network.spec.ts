import { Locator } from "@playwright/test";

import { waitForPageEvent } from "../utils/events";
import { navigate } from "../utils/navigate";
import { useDataFixture } from "../utils/useDataFixture";
import { useRequestFixture } from "../utils/useRequestFixture";

import { expect, test } from "../test";

import { TestItem } from "./templates/model";
import { testRelatedItems } from "./templates/testRelatedItems";
import { mockRequestsWithFixture } from "./templates/utils";

test.describe("Network page", () => {
	const url = "/polkadot";

	const network: TestItem = {
		name: "network",
		requests: [{
			queryProp: "currents",
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

	const relatedBlocks: TestItem = {
		name: "block",
		requests: [{
			queryProp: "blocksConnection",
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

	const relatedHolders: TestItem = {
		name: "holder",
		requests: [{
			queryProp: "accountsConnection",
			squidType: "gs-stats",
			dataType: "itemsConnection"
		}]
	};

	mockRequestsWithFixture(network, [
		relatedExtrinsics,
		relatedBlocks,
		relatedTransfers,
		relatedHolders
	]);

	test.beforeEach(async ({ page }) => {
		await page.route("https://api.coingecko.com/api/v3/simple/price?*", async (route, request) => {
			route.fulfill(await useRequestFixture("usd-rates-request", route));
		});
	});

	test("show network stats", async ({ page, takeScreenshot }) => {
		await navigate(page, "/polkadot");

		const $info = page.getByTestId("item-info");
		const $header = $info.getByTestId("item-header");
		const $stats = $info.getByTestId("network-stats");

		await expect($header).toHaveText(
			await useDataFixture("network-info-data", "header", $header)
		);

		const getNetworkStatsData = async (locator: Locator) => await locator.locator("> div").allInnerTexts();

		await expect(async () => {
			const networkStatsData = await getNetworkStatsData($stats);
			expect(networkStatsData).toEqual(
				await useDataFixture(
					"network-info-data",
					"stats",
					$stats,
					getNetworkStatsData
				)
			);
		}).toPass({timeout: 5000});

		await takeScreenshot("network-info", $info);
	});

	test("shows network token distribution", async ({ page, takeScreenshot }) => {
		await navigate(page, url);

		const tokenDistribution = page.getByTestId("network-token-distribution");

		const $totalIssuance = tokenDistribution.getByTestId("network-total-issuance").locator("div").last();
		await expect($totalIssuance).toBeVisible();
		await expect($totalIssuance).toContainText(
			await useDataFixture("network-info-data", "totalIssuance", $totalIssuance)
		);

		await expect(tokenDistribution.getByTestId("network-token-distribution-chart")).toBeVisible();
		await waitForPageEvent(page, "chart-finished", (event: any) => {
			return event.detail.containerRef?.getAttribute("data-test") === "network-token-distribution-chart";
		});

		await takeScreenshot("network-token-distribution", tokenDistribution);
	});

	testRelatedItems(url, network, relatedExtrinsics, { testCount: false });
	testRelatedItems(url, network, relatedBlocks, { testCount: false });
	testRelatedItems(url, network, relatedTransfers, { testCount: false });
	testRelatedItems(url, network, relatedHolders, { testCount: false });
});

