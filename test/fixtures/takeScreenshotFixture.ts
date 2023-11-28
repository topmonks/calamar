import path from "path";

import { Locator, PlaywrightTestArgs, TestFixture } from "@playwright/test";

import config from "../../playwright.config";

import { takeScreenshot } from "../utils/takeScreenshot";

export type TakeScreenshotFixture = (name: string, element?: Locator, dir?: string) => Promise<Buffer>;

export const takeScreenshotFixture: TestFixture<TakeScreenshotFixture, PlaywrightTestArgs> = async ({ page }, use, testInfo) => {
	const useTakeScreenshot = async (name: string, element?: Locator, dir?: string) => {
		dir = dir || config.screenshotsDir;
		const body = await takeScreenshot(page, element, path.join(dir, `${name}-${testInfo.project.name}.png`));
		testInfo.attach(name, { body, contentType: "image/png" });
		return body;
	};

	await use(useTakeScreenshot);

	if (testInfo.status !== testInfo.expectedStatus) {
		await useTakeScreenshot("test-failed", undefined, testInfo.outputDir);
	}
};
