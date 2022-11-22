import { test as testBase } from "@playwright/test";
import path from "path";

import config from "../../playwright.config";

import { screenshot } from "./screenshot";

type TestFixtures = {
	takeScreenshot: (name: string) => Promise<Buffer>;
};

export const test = testBase.extend<TestFixtures>({
	takeScreenshot: [async ({ page }, use, testInfo) => {
		const takeScreenshot = async (name: string, dir?: string) => {
			dir = dir || config.screenshotsDir;
			const body = await screenshot(page, path.join(dir, `${name}-${testInfo.project.name}.png`));
			testInfo.attach(name, { body, contentType: "image/png" });
			return body;
		};

		await use(takeScreenshot);

		if (testInfo.status !== testInfo.expectedStatus) {
			await takeScreenshot("test-failed", testInfo.outputDir);
		}
	}, {auto: true}]
});

export { expect } from "@playwright/test";
