import { Page } from "@playwright/test";

export function waitForPageEvent(page: Page, event: string, timeout = 30000) {
	return page.evaluate(([event, timeout]) => new Promise((resolve, reject) => {
		window.addEventListener(event, resolve, {once: true});
		timeout && setTimeout(() => reject(`waitForPageEvent: Waiting for page event '${event}' exceeded ${timeout}ms timeout.`), timeout);
	}), [event, timeout] as const);
}
