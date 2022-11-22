import { getEvent } from "../../src/services/eventsService";

import { mockRequest } from "../utils/mockRequest";
import { navigate } from "../utils/navigate";
import { test, expect } from "../utils/test";


test.describe("Event detail page", () => {
	const eventId = "0015163154-000040-44488";
	test("shows event detail page", async ({ page, takeScreenshot }) => {
		await navigate(page, `/kusama/event/${eventId}`, {waitUntil: "data-loaded"});

		await takeScreenshot("event");
	});

	test("shows not found message if event was not found", async ({ page, takeScreenshot }) => {
		const id = "111-22-3";

		await navigate(page, `/kusama/event/${id}`, {waitUntil: "data-loaded"});

		const errorMessage = page.getByTestId("not-found");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText("No event found");

		await takeScreenshot("event-not-found");
	});

	test("show error message when event data fetch fails", async ({ page, takeScreenshot }) => {
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

		await takeScreenshot("event-error");
	});
});
