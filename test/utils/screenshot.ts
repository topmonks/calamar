import { Locator, Page } from "@playwright/test";

const hideSelectors = [
	".MuiTabs-indicator",
	"[data-test=count]",
	"[data-test=time]"
];

export async function screenshot(page: Page, element: Locator|undefined, path: string) {
	await page.evaluate((hideSelectors) => {
		const topBar = document.querySelector<HTMLElement>("[data-test=top-bar");
		if (topBar) {
			topBar.style.position = "relative";
		}

		for (const selector of hideSelectors) {
			for (const el of Array.from(document.querySelectorAll<HTMLElement>(selector))) {
				el.style.display = "none";
			}
		}

		// open error details
		for (const el of Array.from(document.querySelectorAll<HTMLDetailsElement>("[data-test=error] details"))) {
			el.open = true;
		}
	}, hideSelectors);

	const screenshot = element
		? await element.screenshot({path, animations: "disabled"})
		: await page.screenshot({path, fullPage: true, animations: "disabled"});

	await page.evaluate((hideSelectors) => {
		const topBar = document.querySelector<HTMLElement>("[data-test=top-bar");
		if (topBar) {
			topBar.style.position = "";
		}

		for (const selector of hideSelectors) {
			for (const el of Array.from(document.querySelectorAll<HTMLElement>(selector))) {
				el.style.display = "";
			}
		}

		// open error details
		for (const el of Array.from(document.querySelectorAll<HTMLDetailsElement>("[data-test=error] details"))) {
			el.open = false;
		}
	}, hideSelectors);

	return screenshot;
}
