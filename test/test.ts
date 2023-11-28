import { test as baseTest, expect as baseExpect } from "@playwright/test";

import { TakeScreenshotFixture, takeScreenshotFixture } from "./fixtures/takeScreenshotFixture";
import { toHaveTableData } from "./matchers/toHaveTableData";

type TestFixtures = {
	takeScreenshot: TakeScreenshotFixture;
};

export const test = baseTest.extend<TestFixtures>({
	takeScreenshot: [takeScreenshotFixture, {auto: true}],
});

export const expect = baseExpect.extend({
	toHaveTableData
});
