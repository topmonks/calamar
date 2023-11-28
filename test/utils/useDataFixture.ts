import fs from "fs";
import path from "path";
import colors from "colors";

import { Locator } from "@playwright/test";

import { expect } from "../test";

import { addAttachment } from "./addAttachment";
import { editJsonFile } from "./editJsonFile";
import { getTestFixturesDir } from "./getTestFixturesDir";

export async function useDataFixture(fixtureName: string, key: string, locator: Locator, getData?: (locator: Locator) => any|Promise<any>) {
	const fixtureFile = path.join(getTestFixturesDir(), `${fixtureName}.json`);

	const fixtures = fs.existsSync(fixtureFile)
		? JSON.parse(fs.readFileSync(fixtureFile, "utf-8"))
		: {};

	let fixture = fixtures[key];

	const recordedFixtureAttachment = addAttachment(
		`fixtures ${fixtureName}`,
		`fixtures/${fixtureName}.json`,
		"application/json",
		"{}"
	);

	if (!fixture) {
		await expect(locator).toBeVisible();

		// to record the data, we need the data to be fully loaded
		// but we can't wait for it reliably without knowing the data
		// so at least wait some timeout after the element is visible
		await locator.page().waitForTimeout(5000);

		fixture = getData
			? await getData(locator)
			: await locator.textContent();

		expect.soft(undefined, [
			`${colors.red(`missing data fixture '${key}'`)} in '${fixtureFile}'`,
			colors.yellow(`Fixture with current table data is recorded into the attachment '${recordedFixtureAttachment.name}' (${recordedFixtureAttachment.path})`)
		].join("\n\n")).toBeTruthy();
	}

	editJsonFile(recordedFixtureAttachment.path, (data) => ({
		...data,
		[key]: fixture
	}));

	return fixture;
}
