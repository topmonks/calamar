import { expect as baseExpect, Locator } from "@playwright/test";
import { createHash } from "crypto";
import colors from "colors";

import config from "../../playwright.config";

import { getTableData } from "../utils/getTableData";
import { addAttachment } from "../utils/addAttachment";

export async function toHaveTableData(locator: Locator, expected: string[][], options?: { timeout?: number }) {
	try {
		await baseExpect(async () => {
			const tableData = await getTableData(locator);

			baseExpect(tableData.length, "Table has unexpected number of rows").toBe(expected.length);

			for (let i = 0; i < tableData.length; ++i) {
				baseExpect(tableData[i], `Row number ${i + 1} has unexpected data`).toEqual(expected[i]);
			}
		}).toPass({
			timeout: options?.timeout || config.expect?.timeout
		});

		return {
			message: () => "Tables data are equal",
			pass: true
		};
	} catch (e) {
		const tableData = await getTableData(locator);

		const hash = createHash("md5").update(JSON.stringify(tableData)).digest("hex").slice(0, 10);

		const attachment = addAttachment(
			`table data #${hash}`,
			`fixtures/table_data_${hash}.json`,
			"application/json",
			JSON.stringify(tableData, null, 2)
		);

		const errorMessage = [
			e.matcherResult.message,
			colors.yellow(`Fixture with current table data is recorded into the attachment '${attachment.name}' (${attachment.path})`)
		].join("\n\n");

		return {
			...e.matcherResult,
			message: () => errorMessage
		};
	}
}
