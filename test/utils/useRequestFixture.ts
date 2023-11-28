import fs from "fs";
import path from "path";
import { isDeepStrictEqual } from "util";
import colors from "colors";

import { Route } from "@playwright/test";

import { expect } from "../test";

import { addAttachment } from "./addAttachment";
import { getTestFixturesDir } from "./getTestFixturesDir";
import { editJsonFile } from "./editJsonFile";

export interface RequestProps {
	url: string;
	method: string;
	postData: any;
}

export interface ResponseProps {
	status: number;
	body: any;
}

export interface RequestFixture {
	request: RequestProps;
	response: ResponseProps;
}

export async function useRequestFixture(fixtureName: string, route: Route, filterResponse: (response: ResponseProps) => boolean = () => true) {
	const request = route.request();

	const requestProps: RequestProps = {
		url: request.url(),
		method: request.method(),
		postData: request.postDataJSON()
	};

	const fixtureFile = path.join(getTestFixturesDir(), `${fixtureName}.json`);

	const requestFixtures: RequestFixture[] = fs.existsSync(fixtureFile)
		? JSON.parse(fs.readFileSync(fixtureFile, "utf-8"))
		: [];

	let requestFixture = requestFixtures.find(it => isDeepStrictEqual(requestProps, it.request));

	const recordedFixtureAttachment = addAttachment(
		`fixtures ${fixtureName}`,
		`fixtures/${fixtureName}.json`,
		"application/json",
		"[]"
	);

	if (!requestFixture) {
		const response = await route.fetch();

		const body = response.headers()["content-type"]?.match("application/json")
			? await response.json()
			: await response.text();

		requestFixture = {
			request: requestProps,
			response: {
				status: response.status(),
				body
			}
		};

		if (!filterResponse(requestFixture.response)) {
			return {
				response
			};
		}

		expect.soft(undefined, [
			`${colors.red("missing request fixture")} in '${fixtureFile}'`,
			colors.cyan(`Request: ${JSON.stringify(requestProps, null, 2)}`),
			colors.yellow(`Fixture with current response is recorded into the attachment '${recordedFixtureAttachment.name}' (${recordedFixtureAttachment.path})`)
		].join("\n\n")).toBeTruthy();
	}

	editJsonFile(recordedFixtureAttachment.path, (data) => {
		if (!data.find((it: RequestFixture) => isDeepStrictEqual(requestProps, it.request))) {
			return [...data, requestFixture];
		}

		return data;
	});

	return {
		status: requestFixture.response.status,
		body: JSON.stringify(requestFixture.response.body)
	};
}

