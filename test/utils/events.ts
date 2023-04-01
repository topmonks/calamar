import { Page } from "@playwright/test";

declare global {
	interface Window {
		_test_triggeredEvents: [string, any][];
	}
}

export async function capturePageEvents(page: Page, events: string[]) {
	await page.addInitScript((events) => {
		window._test_triggeredEvents = [];
		for (const eventName of events) {
			window.addEventListener(eventName, (event) => {
				window._test_triggeredEvents.push([eventName, event]);
			});
		}
	}, events);
}

export function waitForPageEvent(page: Page, eventName: string, condition?: (event: any) => boolean, options: { timeout?: number } = {}) {
	options = {
		timeout: 10000,
		...options
	};

	return page.evaluate(([eventName, serializedCondition, timeout]) => {
		const condition = new Function(`return ${serializedCondition}`)();

		return new Promise<void>((resolve, reject) => {
			// check if the event was captured before this call
			const triggeredEvent = window._test_triggeredEvents?.find(it => it[0] === eventName && (!condition || condition(it[1])));
			if (triggeredEvent) {
				return resolve();
			}

			const handler = (event: any) => {
				if (!condition || condition(event)) {
					window.removeEventListener(event, handler);
					resolve();
				}
			};

			window.addEventListener(eventName, handler);

			timeout && setTimeout(() => {
				window.removeEventListener(eventName, handler);
				reject(`waitForPageEvent: Waiting for page event '${eventName}' exceeded ${timeout}ms timeout.`);
			}, timeout);
		});
	}, [eventName, condition?.toString(), options.timeout] as const);
}

export async function clearCapturedPageEvents(page: Page, events?: string[]) {
	await page.evaluate((events) => {
		if (!events) {
			window._test_triggeredEvents = [];
		} else {
			for (const event of events) {
				window._test_triggeredEvents = window._test_triggeredEvents.filter(([eventName]) => eventName !== event);
			}
		}
	}, events);
}
