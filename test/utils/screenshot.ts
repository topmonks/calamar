import path from "path";
import { Page } from "@playwright/test";

import config from "../../playwright.config";

export async function screenshot(page: Page, name: string) {
	const background = page.locator("[data-test=background]");

	if (await background.isVisible({timeout: 0})) {
		await background.evaluate(el => el.style.position = "absolute");
	}

	await page.screenshot({
		path: path.join(config.testDir!, "screenshots", `${name}.png`),
		fullPage: true,
		animations: "disabled"
	});

	if (await background.isVisible({timeout: 0})) {
		await background.evaluate(el => el.style.position = "fixed");
	}
}
