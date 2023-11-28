import { matchSquidRequest } from "../../utils/matchSquidRequest";
import { navigate } from "../../utils/navigate";
import { useDataFixture } from "../../utils/useDataFixture";

import { expect, test } from "../../test";

import { TestItem } from "./model";
import { getNotFoundData } from "./utils";

export function testItemNotFound(url: string, item: TestItem) {
	test(`shows not found message if ${item.name} was not found`, async ({ page, takeScreenshot }) => {
		await page.route("**/*", (route) => {
			for (const request of item.requests) {
				if (matchSquidRequest(route.request(), request)) {
					return route.fulfill(getNotFoundData(request));
				}
			}

			route.fallback();
		});

		await navigate(page, url);

		const $info = page.getByTestId("item-info");
		const $header = $info.getByTestId("item-header");
		const $notFound = $info.getByTestId("not-found");

		await expect($header).toHaveText(
			await useDataFixture(`${item.name}-info-data`, "notFoundHeader", $header)
		);

		await expect($notFound).toHaveText(
			await useDataFixture(`${item.name}-info-data`, "notFound", $notFound)
		);

		await takeScreenshot(`${item.name}-not-found`, $info);
	});
}
