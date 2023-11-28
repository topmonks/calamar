import { Page } from "@playwright/test";

export async function hideElements(page: Page, selectors: string[], hide = true) {
	await page.evaluate(([selectors, hide]) => {
		for (const selector of selectors) {
			for (const el of Array.from(document.querySelectorAll<HTMLElement>(selector))) {
				el.style.display = hide ? "none" : "";
			}
		}
	}, [selectors, hide] as const);
}
