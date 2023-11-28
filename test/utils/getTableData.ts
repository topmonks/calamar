import { Locator } from "@playwright/test";

import { hideElements } from "./hideSelectors";

const hideSelectors = [
	"[data-test=time][data-time-format=fromNow]"
];

export async function getTableData(locator: Locator) {
	await hideElements(locator.page(), hideSelectors, true);

	const rows = await locator.locator("> tbody > tr").all();

	const tableData: string[][] = [];

	for (const row of rows) {
		tableData.push(await row.locator("> td").allInnerTexts());
	}

	await hideElements(locator.page(), hideSelectors, false);

	return tableData;
}
