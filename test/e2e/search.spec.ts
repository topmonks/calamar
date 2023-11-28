import { matchSquidRequest } from "../utils/matchSquidRequest";
import { navigate } from "../utils/navigate";
import { useDataFixture } from "../utils/useDataFixture";
import { useRequestFixture } from "../utils/useRequestFixture";

import { expect, test } from "../test";

import { TestItem } from "./templates/model";
import { testRelatedItems } from "./templates/testRelatedItems";
import { testRelatedItemsError } from "./templates/testRelatedItemsError";
import { testRedirect } from "./templates/testRedirect";
import { getNotFoundData } from "./templates/utils";

test.describe("Search", () => {
	test.describe("multiple networks", () => {
		test.describe("by block height", () => {
			const height = 123;
			const url = `/search?query=${height}&network=polkadot&network=kusama&network=acala`;

			const search: TestItem = {
				name: "search-multiple-by-block-height",
				requests: [{
					squidType: "gs-explorer",
					queryProp: "blocks",
					variables: {
						blocksFilter: {
							height_eq: height
						}
					},
					dataType: "itemsConnection"
				}]
			};

			const blockResults: TestItem = {
				name: "block",
				requests: []
			};

			test.beforeEach(async ({ page }) => {
				await page.route("**/*", async (route) => {
					for (const request of search.requests) {
						if (matchSquidRequest(route.request(), request)) {
							return route.fulfill(
								await useRequestFixture(`${search.name}-request`, route)
							);
						}
					}

					route.fallback();
				});
			});

			testRelatedItems(url, search, blockResults, {
				wrapperTestId: "search-results"
			});

			testRelatedItemsError(url, search, blockResults, search.requests, {
				wrapperTestId: "search-results",
				clickTab: false
			});

			test("redirects to block's detail if only one found", async ({ page, takeScreenshot }) => {
				await page.route("**/*", async (route) => {
					for (const request of search.requests) {
						if (matchSquidRequest(route.request(), { ...request, network: "kusama" })) {
							return route.fulfill(
								await useRequestFixture(`${search.name}-request`, route)
							);
						} else if (matchSquidRequest(route.request(), request)) {
							return route.fulfill(getNotFoundData(request));
						}
					}

					route.fallback();
				});

				await navigate(page, url);
				await page.waitForURL(new RegExp(`\\/kusama\\/block\\/${height}`));
			});

			test("shows not found message if no block was found", async ({ page, takeScreenshot }) => {
				await page.route("**/*", async (route) => {
					for (const request of search.requests) {
						if (matchSquidRequest(route.request(), request)) {
							return route.fulfill(getNotFoundData(request));
						}
					}

					route.fallback();
				});

				await navigate(page, url);

				const $searchResults = page.getByTestId("search-results");
				const $notFound = $searchResults.getByTestId("not-found");

				await expect($notFound).toHaveText(
					await useDataFixture(`${search.name}-data`, "notFound", $notFound)
				);

				await takeScreenshot(`${search.name}-not-found`, $searchResults);
			});
		});

		test.describe("by block hash", () => {
			const hash = "0xaff52c40552c33ecd7248506a42d20e2cd44e64bbb299cf6cb979339e90c4211";
			const url = `/search?query=${hash}&network=polkadot&network=kusama&network=acala`;

			const search: TestItem = {
				name: "search-multiple-by-block-hash",
				requests: [{
					squidType: "gs-explorer",
					queryProp: [
						"blocks",
						"extrinsics"
					],
					variables: {
						blocksFilter: {
							hash_eq: hash
						},
						extrinsicsFilter: {
							extrinsicHash_eq: hash
						}
					},
					dataType: "itemsConnection"
				}]
			};

			test.beforeEach(async ({ page }) => {
				await page.route("**/*", async (route) => {
					for (const request of search.requests) {
						if (matchSquidRequest(route.request(), request)) {
							return route.fulfill(
								await useRequestFixture(`${search.name}-request`, route)
							);
						}
					}

					route.fallback();
				});
			});

			testRedirect("redirects to block's detail if only one block found", url, "/kusama/block/123");
		});

		test.describe("by extrinsic hash", () => {
			const hash = "0xcf52705d1ade64fc0b05859ac28358c0770a217dd76b75e586ae848c56ae810d";
			const url = `/search?query=${hash}&network=polkadot&network=kusama&network=acala`;

			const search: TestItem = {
				name: "search-multiple-by-extrinsic-hash",
				requests: [{
					squidType: "gs-explorer",
					queryProp: [
						"blocks",
						"extrinsics"
					],
					variables: {
						blocksFilter: {
							hash_eq: hash
						},
						extrinsicsFilter: {
							extrinsicHash_eq: hash
						}
					},
					dataType: "itemsConnection"
				}]
			};

			const extrinsicResults: TestItem = {
				name: "extrinsic",
				requests: []
			};

			test.beforeEach(async ({ page }) => {
				await page.route("**/*", async (route) => {
					for (const request of search.requests) {
						if (matchSquidRequest(route.request(), request)) {
							return route.fulfill(
								await useRequestFixture(`${search.name}-request`, route)
							);
						}
					}

					route.fallback();
				});
			});

			testRelatedItems(url, search, extrinsicResults, {
				wrapperTestId: "search-results"
			});

			test("redirects to extrinsic's detail", async ({ page }) => {
				const hash = "0x1775fe247d147290360784ea7a9220345366caee16b4879d97877ba153b0a701";
				const url = `/search?query=${hash}&network=polkadot&network=kusama&network=acala`;

				await page.route("**/*", async (route) => {
					for (const request of search.requests) {
						if (matchSquidRequest(route.request(), {
							...request,
							variables: {
								blocksFilter: {
									hash_eq: hash
								},
								extrinsicsFilter: {
									extrinsicHash_eq: hash
								}
							}
						})) {
							return route.fulfill(
								await useRequestFixture(`${search.name}-request`, route)
							);
						}
					}

					route.fallback();
				});

				await navigate(page, url);
				await page.waitForURL(/\/kusama\/extrinsic\/123-0/);
			});
		});

		test.describe("by account public key", () => {
			const publicKey = "0x4aca27604ad033f7c45b1cfc23b55520826db4abb69a8a7c165461c40f330c6b";
			const url = `/search?query=${publicKey}&network=polkadot&network=kusama&network=acala`;

			const search: TestItem = {
				name: "search-multiple-by-account-public-key",
				requests: [{
					squidType: "gs-explorer",
					queryProp: [
						"blocks",
						"extrinsics"
					],
					variables: {
						blocksFilter: {
							hash_eq: publicKey
						},
						extrinsicsFilter: {
							extrinsicHash_eq: publicKey
						}
					},
					dataType: "itemsConnection"
				}]
			};

			const accountResults: TestItem = {
				name: "account",
				requests: []
			};

			test.beforeEach(async ({ page }) => {
				await page.route("**/*", async (route) => {
					for (const request of search.requests) {
						if (matchSquidRequest(route.request(), request)) {
							return route.fulfill(getNotFoundData(request));
						}
					}

					route.fallback();
				});
			});

			testRelatedItems(url, search, accountResults, {
				wrapperTestId: "search-results"
			});
		});

		test.describe("by account encoded address", () => {
			const address = "EGP7XztdTosm1EmaATZVMjSWujGEj9nNidhjqA2zZtttkFg";
			const url = `/search?query=${address}&network=polkadot&network=kusama&network=statemine`;

			const search: TestItem = {
				name: "search-multiple-by-account-encoded-address",
				requests: []
			};

			const accountResults: TestItem = {
				name: "account",
				requests: []
			};

			testRelatedItems(url, search, accountResults, {
				wrapperTestId: "search-results"
			});

			testRedirect(
				"redirects to account's detail if found",
				`/search?query=${address}&network=polkadot&network=kusama&network=acala`,
				`/kusama/account/${address}`
			);
		});

		test.describe("by extrinsic or event pallet", () => {
			const query = "balances";
			const url = `/search?query=${query}&network=polkadot&network=kusama&network=acala`;

			const search: TestItem = {
				name: "search-multiple-by-pallet",
				requests: [{
					squidType: "gs-explorer",
					queryProp: [
						"extrinsicsByNameCounter",
						"eventsByNameCounter"
					],
					variables: {
						extrinsicsByNameCounterId: "Extrinsics.Balances",
						eventsByNameCounterId: "Events.Balances"
					},
					dataType: "itemsConnection"
				}]
			};

			const extrinsicResults: TestItem = {
				name: "extrinsic",
				requests: []
			};

			const eventResults: TestItem = {
				name: "event",
				requests: []
			};

			test.beforeEach(async ({ page }) => {
				await page.route("**/*", async (route) => {
					for (const request of search.requests) {
						if (matchSquidRequest(route.request(), request)) {
							return route.fulfill(
								await useRequestFixture(`${search.name}-request`, route)
							);
						}
					}

					route.fallback();
				});
			});

			testRelatedItems(url, search, extrinsicResults, {
				wrapperTestId: "search-results"
			});

			testRelatedItems(url, search, eventResults, {
				wrapperTestId: "search-results"
			});
		});

		test.describe("by extrinsic or event name", () => {
			const query = "balances.transfer";
			const url = `/search?query=${query}&network=polkadot&network=kusama&network=acala`;

			const search: TestItem = {
				name: "search-multiple-by-name",
				requests: [{
					squidType: "gs-explorer",
					queryProp: [
						"extrinsicsByNameCounter",
						"eventsByNameCounter"
					],
					variables: {
						extrinsicsByNameCounterId: "Extrinsics.Balances.transfer",
						eventsByNameCounterId: "Events.Balances.Transfer"
					},
					dataType: "itemsConnection"
				}]
			};

			const extrinsicResults: TestItem = {
				name: "extrinsic",
				requests: []
			};

			const eventResults: TestItem = {
				name: "event",
				requests: []
			};

			test.beforeEach(async ({ page }) => {
				await page.route("**/*", async (route) => {
					for (const request of search.requests) {
						if (matchSquidRequest(route.request(), request)) {
							return route.fulfill(
								await useRequestFixture(`${search.name}-request`, route)
							);
						}
					}

					route.fallback();
				});
			});

			testRelatedItems(url, search, extrinsicResults, {
				wrapperTestId: "search-results"
			});

			testRelatedItems(url, search, eventResults, {
				wrapperTestId: "search-results"
			});
		});
	});

	test.describe("single network", () => {
		test.describe("by block height", () => {
			const height = 123;
			const url = `/search?query=${height}&network=kusama`;

			const search: TestItem = {
				name: "search-single-by-block-height",
				requests: [{
					squidType: "gs-explorer",
					queryProp: "blocks",
					variables: {
						blocksFilter: {
							height_eq: height
						}
					},
					dataType: "itemsConnection"
				}]
			};

			test.beforeEach(async ({ page }) => {
				await page.route("**/*", async (route) => {
					for (const request of search.requests) {
						if (matchSquidRequest(route.request(), request)) {
							return route.fulfill(
								await useRequestFixture(`${search.name}-request`, route)
							);
						}
					}

					route.fallback();
				});
			});

			testRedirect("redirects to block's detail if found", url, `/kusama/block/${height}`);

			test("shows not found message if no block was found", async ({ page, takeScreenshot }) => {
				await page.route("**/*", async (route) => {
					for (const request of search.requests) {
						if (matchSquidRequest(route.request(), request)) {
							return route.fulfill(getNotFoundData(request));
						}
					}

					route.fallback();
				});

				await navigate(page, url);

				const $searchResults = page.getByTestId("search-results");
				const $notFound = $searchResults.getByTestId("not-found");

				await expect($notFound).toHaveText(
					await useDataFixture(`${search.name}-data`, "notFound", $notFound)
				);

				await takeScreenshot(`${search.name}-not-found`, $searchResults);
			});
		});

		test.describe("by block hash", () => {
			const hash = "0xaff52c40552c33ecd7248506a42d20e2cd44e64bbb299cf6cb979339e90c4211";
			const url = `/search?query=${hash}&network=kusama`;

			const search: TestItem = {
				name: "search-single-by-block-hash",
				requests: [{
					squidType: "gs-explorer",
					queryProp: [
						"blocks",
						"extrinsics"
					],
					variables: {
						blocksFilter: {
							hash_eq: hash
						},
						extrinsicsFilter: {
							extrinsicHash_eq: hash
						}
					},
					dataType: "itemsConnection"
				}]
			};

			test.beforeEach(async ({ page }) => {
				await page.route("**/*", async (route) => {
					for (const request of search.requests) {
						if (matchSquidRequest(route.request(), request)) {
							return route.fulfill(
								await useRequestFixture(`${search.name}-request`, route)
							);
						}
					}

					route.fallback();
				});
			});

			testRedirect("redirects to block's detail", url, "/kusama/block/123");
		});

		test.describe("by extrinsic hash", () => {
			const hash = "0xcf52705d1ade64fc0b05859ac28358c0770a217dd76b75e586ae848c56ae810d";
			const url = `/search?query=${hash}&network=kusama`;

			const search: TestItem = {
				name: "search-single-by-extrinsic-hash",
				requests: [{
					squidType: "gs-explorer",
					queryProp: [
						"blocks",
						"extrinsics"
					],
					variables: {
						blocksFilter: {
							hash_eq: hash
						},
						extrinsicsFilter: {
							extrinsicHash_eq: hash
						}
					},
					dataType: "itemsConnection"
				}]
			};

			const extrinsicResults: TestItem = {
				name: "extrinsic",
				requests: []
			};

			test.beforeEach(async ({ page }) => {
				await page.route("**/*", async (route) => {
					for (const request of search.requests) {
						if (matchSquidRequest(route.request(), request)) {
							return route.fulfill(
								await useRequestFixture(`${search.name}-request`, route)
							);
						}
					}

					route.fallback();
				});
			});

			testRelatedItems(url, search, extrinsicResults, {
				wrapperTestId: "search-results"
			});

			test("redirects to extrinsic's detail", async ({ page }) => {
				const hash = "0x1775fe247d147290360784ea7a9220345366caee16b4879d97877ba153b0a701";
				const url = `/search?query=${hash}&network=kusama`;

				await page.route("**/*", async (route) => {
					for (const request of search.requests) {
						if (matchSquidRequest(route.request(), {
							...request,
							variables: {
								blocksFilter: {
									hash_eq: hash
								},
								extrinsicsFilter: {
									extrinsicHash_eq: hash
								}
							}
						})) {
							return route.fulfill(
								await useRequestFixture(`${search.name}-request`, route)
							);
						}
					}

					route.fallback();
				});

				await navigate(page, url);
				await page.waitForURL(/\/kusama\/extrinsic\/123-0/);
			});
		});

		test.describe("by account public key", () => {
			const publicKey = "0x4aca27604ad033f7c45b1cfc23b55520826db4abb69a8a7c165461c40f330c6b";
			const url = `/search?query=${publicKey}&network=kusama`;

			const search: TestItem = {
				name: "search-single-by-account-public-key",
				requests: [{
					squidType: "gs-explorer",
					queryProp: [
						"blocks",
						"extrinsics"
					],
					variables: {
						blocksFilter: {
							hash_eq: publicKey
						},
						extrinsicsFilter: {
							extrinsicHash_eq: publicKey
						}
					},
					dataType: "itemsConnection"
				}]
			};

			test.beforeEach(async ({ page }) => {
				await page.route("**/*", async (route) => {
					for (const request of search.requests) {
						if (matchSquidRequest(route.request(), request)) {
							return route.fulfill(getNotFoundData(request));
						}
					}

					route.fallback();
				});
			});

			testRedirect("redirects to account's detail", url, "/kusama/account/EGP7XztdTosm1EmaATZVMjSWujGEj9nNidhjqA2zZtttkFg");
		});

		test.describe("by account encoded address", () => {
			const address = "EGP7XztdTosm1EmaATZVMjSWujGEj9nNidhjqA2zZtttkFg";
			const url = `/search?query=${address}&network=kusama`;

			testRedirect("redirects to account's detail", url, `/kusama/account/${address}`);
		});

		test.describe("by extrinsic or event pallet", () => {
			const query = "balances";
			const url = `/search?query=${query}&network=kusama`;

			const search: TestItem = {
				name: "search-single-by-pallet",
				requests: [{
					squidType: "gs-explorer",
					queryProp: [
						"extrinsicsByNameCounter",
						"eventsByNameCounter"
					],
					variables: {
						extrinsicsByNameCounterId: "Extrinsics.Balances",
						eventsByNameCounterId: "Events.Balances"
					},
					dataType: "item"
				}, {
					squidType: "gs-explorer",
					queryProp: [
						"extrinsics",
						"events"
					],
					variables: {
						extrinsicsFilter: {
							mainCall: {
								palletName_eq: "Balances",
							}
						},
						eventsFilter: {
							palletName_eq: "Balances"
						}
					},
					dataType: "itemsConnection"
				}, {
					squidType: "archive",
					queryProp: "events",
					dataType: "items"
				}]
			};

			const extrinsicResults: TestItem = {
				name: "extrinsic",
				requests: []
			};

			const eventResults: TestItem = {
				name: "event",
				requests: []
			};

			test.beforeEach(async ({ page }) => {
				await page.route("**/*", async (route) => {
					for (const request of search.requests) {
						if (matchSquidRequest(route.request(), request)) {
							return route.fulfill(
								await useRequestFixture(`${search.name}-request`, route)
							);
						}
					}

					route.fallback();
				});
			});

			testRelatedItems(url, search, extrinsicResults, {
				wrapperTestId: "search-results"
			});

			testRelatedItems(url, search, eventResults, {
				wrapperTestId: "search-results"
			});
		});

		test.describe("by extrinsic or event name", () => {
			const query = "balances.transfer";
			const url = `/search?query=${query}&network=kusama`;

			const search: TestItem = {
				name: "search-single-by-name",
				requests: [{
					squidType: "gs-explorer",
					queryProp: [
						"extrinsicsByNameCounter",
						"eventsByNameCounter"
					],
					variables: {
						extrinsicsByNameCounterId: "Extrinsics.Balances.transfer",
						eventsByNameCounterId: "Events.Balances.Transfer"
					},
					dataType: "item"
				}, {
					squidType: "gs-explorer",
					queryProp: [
						"extrinsics",
						"events"
					],
					variables: {
						extrinsicsFilter: {
							mainCall: {
								palletName_eq: "Balances",
								callName_eq: "transfer"
							}
						},
						eventsFilter: {
							palletName_eq: "Balances",
							eventName_eq: "Transfer"
						}
					},
					dataType: "itemsConnection"
				}, {
					squidType: "archive",
					queryProp: "events",
					dataType: "items"
				}]
			};

			const extrinsicResults: TestItem = {
				name: "extrinsic",
				requests: []
			};

			const eventResults: TestItem = {
				name: "event",
				requests: []
			};

			test.beforeEach(async ({ page }) => {
				await page.route("**/*", async (route) => {
					for (const request of search.requests) {
						if (matchSquidRequest(route.request(), request)) {
							return route.fulfill(
								await useRequestFixture(`${search.name}-request`, route)
							);
						}
					}

					route.fallback();
				});
			});

			testRelatedItems(url, search, extrinsicResults, {
				wrapperTestId: "search-results"
			});

			testRelatedItems(url, search, eventResults, {
				wrapperTestId: "search-results"
			});
		});
	});
});
