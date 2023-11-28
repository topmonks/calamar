import path from "path";

import config from "../../playwright.config";

import { test } from "../test";

export function getTestSpecFile() {
	return path.join(__dirname, "..", "..", config.testDir!, test.info().titlePath[0]);
}
