import { matchSquidRequest } from "../../utils/matchSquidRequest";
import { navigate } from "../../utils/navigate";
import { upperFirst } from "../../utils/upperFirst";
import { useDataFixture } from "../../utils/useDataFixture";

import { expect, test } from "../../test";

import { TestItem } from "./model";

export function testItemError(url: string, item: TestItem) {
	test(`shows error message if ${item.name} info fetch fails`, async ({ page, takeScreenshot }) => {
		const errorMessage = `${upperFirst(item.name)} error`;

		await page.route("**/*", (route) => {
			for (const request of item.requests) {
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

		const $info = page.getByTestId("item-info");
		const $header = $info.getByTestId("item-header");
		const $error = $info.getByTestId("error");

		await expect($header).toHaveText(
			await useDataFixture(`${item.name}-info-data`, "errorHeader", $header)
		);

		await expect($error).toHaveText(
			await useDataFixture(`${item.name}-info-data`, "error", $error)
		);

		await takeScreenshot(`${item.name}-error`, $info);
	});
}
