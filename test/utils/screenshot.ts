import { Page } from "@playwright/test";

const hideSelectors = [
	".MuiTabs-indicator",
	"[data-test=count]",
	"[data-test=time]"
];

export async function screenshot(page: Page, path: string) {
	page.evaluate((hideSelectors) => {
		const topBar = document.querySelector<HTMLElement>("[data-test=top-bar");
		if (topBar) {
			topBar.style.position = "relative";
		}

		const background = document.querySelector<HTMLElement>("[data-test=background]");
		if (background) {
			background.style.position = "absolute";
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

	const screenshot = await page.screenshot({
		path,
		fullPage: true,
		animations: "disabled"
	});

	page.evaluate((hideSelectors) => {
		const topBar = document.querySelector<HTMLElement>("[data-test=top-bar");
		if (topBar) {
			topBar.style.position = "";
		}

		const background = document.querySelector<HTMLElement>("[data-test=background]");
		if (background) {
			background.style.position = "";
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
