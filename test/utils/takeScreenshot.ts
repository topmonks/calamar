import { Locator, Page } from "@playwright/test";

import { hideElements } from "./hideSelectors";

const hideSelectors = [
	".MuiTabs-indicator",
	".MuiTab-root .MuiCircularProgress-root",
	"[data-test=time][data-time-format=fromNow]"
];

export async function takeScreenshot(page: Page, element: Locator|undefined, path: string) {
	await hideElements(page, hideSelectors, true);

	await page.evaluate(() => {
		const topBar = document.querySelector<HTMLElement>("[data-test=top-bar");
		if (topBar) {
			topBar.style.position = "relative";
		}

		// open error details
		for (const el of Array.from(document.querySelectorAll<HTMLDetailsElement>("[data-test=error] details"))) {
			el.open = true;
		}
	});

	const screenshot = element
		? await element.screenshot({path, animations: "disabled"})
		: await page.screenshot({path, fullPage: true, animations: "disabled"});

	await page.evaluate(() => {
		const topBar = document.querySelector<HTMLElement>("[data-test=top-bar");
		if (topBar) {
			topBar.style.position = "";
		}

		// open error details
		for (const el of Array.from(document.querySelectorAll<HTMLDetailsElement>("[data-test=error] details"))) {
			el.open = false;
		}
	});

	await hideElements(page, hideSelectors, false);

	return screenshot;
}
