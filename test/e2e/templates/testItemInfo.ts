import { getTableData } from "../../utils/getTableData";
import { navigate } from "../../utils/navigate";
import { useDataFixture } from "../../utils/useDataFixture";

import { expect, test } from "../../test";

import { TestItem } from "./model";

export function testItemInfo(url: string, item: TestItem) {
	test(`shows ${item.name} info`, async ({ page, takeScreenshot }) => {
		await navigate(page, url);

		const $info = page.getByTestId("item-info");
		const $header = $info.getByTestId("item-header");
		const $infoTable = $info.locator("table").first();

		await expect($header).toHaveText(
			await useDataFixture(`${item.name}-info-data`, "header", $header)
		);

		await expect($infoTable).toHaveTableData(
			await useDataFixture(`${item.name}-info-data`, "infoTable", $infoTable, getTableData)
		);

		await takeScreenshot(`${item.name}-info`, $info);
	});
}
