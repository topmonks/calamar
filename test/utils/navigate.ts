import { Page } from "@playwright/test";

import { capturePageEvents, waitForPageEvent } from "./events";

interface GotoOptions {
	referrer?: string;
	timeout?: number;
	waitUntil?: "data-loaded"|"load"|"domcontentloaded"|"networkidle"|"commit";
}

const customEvents = ["data-loaded", "chart-finished"];

export async function navigate(page: Page, url: string, options: GotoOptions = {}) {
	let customEvent: string|undefined = undefined;

	if (options.waitUntil && customEvents.includes(options.waitUntil)) {
		customEvent = options.waitUntil;
		options.waitUntil = "domcontentloaded";
	}

	await capturePageEvents(page, customEvents);

	await page.goto(url, options as any);

	if (customEvent) {
		await waitForPageEvent(page, customEvent, undefined, {timeout: options.timeout});
	}

	await page.evaluate(() => document.fonts.ready);
}
