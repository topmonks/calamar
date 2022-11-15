import { Page } from "@playwright/test";

export async function capturePageEvents(page: Page, events: string[]) {
	await page.addInitScript((events) => {
		(window as any)._test_tiggeredEvents = {};
		for (const event of events) {
			window.addEventListener(event, () => {
				(window as any)._test_tiggeredEvents[event] = true;
			}, {once: true});
		}
	}, events);
}
