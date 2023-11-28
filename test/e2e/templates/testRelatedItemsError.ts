import pluralize from "pluralize";

import { matchSquidRequest } from "../../utils/matchSquidRequest";
import { navigate } from "../../utils/navigate";
import { useDataFixture } from "../../utils/useDataFixture";

import { expect, test } from "../../test";

import { RequestOptions, TestItem } from "./model";

export interface TestRelatedItemsOptions {
	wrapperTestId?: string;
	clickTab?: boolean;
}

export function testRelatedItemsError(url: string, item: TestItem, relatedItem: TestItem, requestsToFail: RequestOptions[], options: TestRelatedItemsOptions = {}) {
	const {wrapperTestId = "related-items", clickTab = true} = options;

	test(`shows error message when ${relatedItem.name} items fetch fails`, async ({ page, takeScreenshot }) => {
		const errorMessage = `${pluralize(relatedItem.name)} error`;

		await page.route("**/*", (route) => {
			for (const request of requestsToFail) {
				if (matchSquidRequest(route.request(), request)) {
					return route.fulfill({
						status: 200,
						body: JSON.stringify({
							errors: [{
								message: errorMessage
							}]
						})
					});
				}
			}

			route.fallback();
		});

		await navigate(page, url);

		const $relatedItems = page.getByTestId(wrapperTestId);
		const $relatedItemsError = $relatedItems.getByTestId("error");

		if (clickTab) {
			const $relatedItemsTab = $relatedItems.getByTestId(`${pluralize(relatedItem.name)}-tab`);
			await $relatedItemsTab.click();
		}

		await expect($relatedItemsError).toBeVisible();
		await expect($relatedItemsError).toHaveText(
			await useDataFixture(`${item.name}-${pluralize(relatedItem.name)}-data`, "error", $relatedItemsError)
		);

		await takeScreenshot(`${item.name}-${pluralize(relatedItem.name)}-error`, $relatedItems);
	});
}
