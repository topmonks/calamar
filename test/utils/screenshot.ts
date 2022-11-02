import path from "path";
import { Page } from "@playwright/test";

import config from "../../playwright.config";

const hideSelectors = [
	"[data-test=count]"
];

export async function screenshot(page: Page, name: string) {
	page.evaluate((hideSelectors) => {
		const background = document.querySelector<HTMLElement>("[data-test=background]");
		if (background) {
			background.style.position = "absolute";
		}

		for (const selector of hideSelectors) {
			for (const el of Array.from(document.querySelectorAll<HTMLElement>(selector))) {
				el.style.display = "none";
			}
		}
	}, hideSelectors);

	await page.waitForTimeout(500); // wait for transitions

	await page.screenshot({
		path: path.join(config.testDir!, "screenshots", `${name}.png`),
		fullPage: true,
		animations: "disabled"
	});

	page.evaluate((hideSelectors) => {
		const background = document.querySelector<HTMLElement>("[data-test=background]");
		if (background) {
			background.style.position = "";
		}

		for (const selector of hideSelectors) {
			for (const el of Array.from(document.querySelectorAll<HTMLElement>(selector))) {
				el.style.display = "";
			}
		}
	}, hideSelectors);

	await page.waitForTimeout(500); // wait for transitions
}
