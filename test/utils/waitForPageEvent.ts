import { Page } from "@playwright/test";

export function waitForPageEvent(page: Page, event: string, options: { timeout?: number } = {}) {
	options = {
		timeout: 10000,
		...options
	};

	return page.evaluate(([event, timeout]) => new Promise<void>((resolve, reject) => {
		// check if the event was captured before this call
		if ((window as any)._test_tiggeredEvents?.[event]) {
			delete (window as any)._test_tiggeredEvents[event];
			return resolve();
		}

		window.addEventListener(event, () => resolve(), {once: true});
		timeout && setTimeout(() => reject(`waitForPageEvent: Waiting for page event '${event}' exceeded ${timeout}ms timeout.`), timeout);
	}), [event, options.timeout] as const);
}
