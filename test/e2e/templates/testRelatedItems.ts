import pluralize from "pluralize";

import { getTableData } from "../../utils/getTableData";
import { navigate } from "../../utils/navigate";
import { useDataFixture } from "../../utils/useDataFixture";

import { test, expect } from "../../test";

import { TestItem } from "./model";

export interface TestRelatedItemsOptions {
	testCount?: boolean;
	wrapperTestId?: string;
}

export function testRelatedItems(url: string, item: TestItem, relatedItem: TestItem, options: TestRelatedItemsOptions = {}) {
	test(`shows ${pluralize(relatedItem.name)}`, async ({ page, takeScreenshot }) => {
		await navigate(page, url);

		const $relatedItems = page.getByTestId(options.wrapperTestId || "related-items");
		const $relatedItemsTab = $relatedItems.getByTestId(`${pluralize(relatedItem.name)}-tab`);
		const $relatedItemsTable = $relatedItems.getByTestId(`${pluralize(relatedItem.name)}-items`).locator("table").first();

		await $relatedItemsTab.click();

		if (options.testCount || options.testCount === undefined) {
			const $relatedItemsCount = $relatedItemsTab.getByTestId("count");
			await expect($relatedItemsCount).toHaveText(
				await useDataFixture(
					`${item.name}-${pluralize(relatedItem.name)}-data`,
					"itemsCount",
					$relatedItemsCount,
				)
			);
		}

		await expect($relatedItemsTable).toHaveTableData(
			await useDataFixture(
				`${item.name}-${pluralize(relatedItem.name)}-data`,
				"itemsTable",
				$relatedItemsTable,
				getTableData
			)
		);

		await takeScreenshot(`${item.name}-${pluralize(relatedItem.name)}`, $relatedItems);
	});
}
