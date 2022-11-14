import { test, expect } from "@playwright/test";

import { getEvent } from "../../src/services/eventsService";

import { mockRequest } from "../utils/mockRequest";
import { navigate } from "../utils/navigate";
import { screenshot } from "../utils/screenshot";
import { waitForPageEvent } from "../utils/waitForPageEvent";

test.describe("Event detail page", () => {
	const eventId = "0015163154-000040-44488";
	test("shows event detail page", async ({ page }) => {
		await navigate(page, `/kusama/event/${eventId}`, {waitUntil: "data-loaded"});

		await screenshot(page, "event");
	});

	test("show error message when event data fetch fails", async ({ page }) => {
		mockRequest(
			page,
			() => getEvent("kusama", { id_eq: eventId }),
			(route) => route.fulfill({
				status: 200,
				body: JSON.stringify({
					errors: [{
						message: "Event error"
					}]
				})
			})
		);

		await navigate(page, `/kusama/event/${eventId}`, {waitUntil: "data-loaded"});

		const errorMessage = page.getByTestId("error");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(/Unexpected error/);
		await expect(errorMessage).toHaveText(/Event error/);

		await screenshot(page, "eventError");
	});
});
