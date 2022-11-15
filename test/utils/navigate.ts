import { Page } from "@playwright/test";

import { capturePageEvents } from "./captureEvents";
import { waitForPageEvent } from "./waitForPageEvent";

interface GotoOptions {
	referrer?: string;
	timeout?: number;
	waitUntil?: "data-loaded"|"load"|"domcontentloaded"|"networkidle"|"commit";
}

const customEvents = ["data-loaded"];

export async function navigate(page: Page, url: string, options: GotoOptions = {}) {
	let customEvent: string|undefined = undefined;

	if (options.waitUntil && customEvents.includes(options.waitUntil)) {
		customEvent = options.waitUntil;
		options.waitUntil = "domcontentloaded";
	}

	await capturePageEvents(page, customEvents);

	await page.goto(url, options as any);

	if (customEvent) {
		await waitForPageEvent(page, customEvent, {timeout: options.timeout});
	}

	await page.evaluate(() => document.fonts.ready);
}
