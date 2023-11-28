import pluralize from "pluralize";

import { emptyItemsResponse } from "../../../src/utils/itemsResponse";
import { matchSquidRequest } from "../../utils/matchSquidRequest";
import { useRequestFixture } from "../../utils/useRequestFixture";

import { test } from "../../test";

import { RequestDataType, RequestOptions, TestItem } from "./model";

export function getNotFoundData(request: RequestOptions) {
	const { queryProp, dataType } = request;

	let data: any = null;

	switch (dataType) {
		case "item":
			data = null;
			break;
		case "items":
			data = [];
			break;
		case "itemsConnection":
			data = {
				edges: [],
				pageInfo: {
					startCursor: "",
					endCursor: "",
					hasPreviousPage: false,
					hasNextPage: false
				},
				totalCount: 0
			};
			break;
	}

	const queryProps = Array.isArray(queryProp) ? queryProp : [queryProp];

	return {
		status: 200,
		body: JSON.stringify({
			data: Object.fromEntries(queryProps.map(it => [it, data]))
		})
	};
}

export function mockRequestsWithFixture(item: TestItem, relatedItems: TestItem[] = []) {
	test.beforeEach(async ({ page }) => {
		await page.route("**/*", async (route) => {
			for (const request of item.requests) {
				if (matchSquidRequest(route.request(), request)) {
					return route.fulfill(
						await useRequestFixture(`${item.name}-info-request`, route)
					);
				}
			}

			for (const relatedItem of relatedItems) {
				for (const request of relatedItem.requests) {
					if (matchSquidRequest(route.request(), request)) {
						return route.fulfill(
							await useRequestFixture(`${item.name}-${pluralize(relatedItem.name)}-request`, route)
						);
					}
				}
			}

			await route.fallback();
		});
	});
}
