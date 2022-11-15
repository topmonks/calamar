import { test, expect } from "@playwright/test";

import { getCall } from "../../src/services/callsService";
import { getEvents } from "../../src/services/eventsService";

import { mockRequest } from "../utils/mockRequest";
import { navigate } from "../utils/navigate";
import { screenshot } from "../utils/screenshot";
import { waitForPageEvent } from "../utils/waitForPageEvent";

test.describe("Call detail page", () => {
	const callId = "0015163154-000002-44488";

	test("shows call detail page with events", async ({ page }) => {
		await navigate(page, `/kusama/call/${callId}`, {waitUntil: "data-loaded"});

		await screenshot(page, "callWithEvents");
	});

	test("shows not found message if call was not found", async ({ page }) => {
		const id = "111-22-3";

		await navigate(page, `/kusama/call/${id}`, {waitUntil: "data-loaded"});

		const errorMessage = page.getByTestId("not-found");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText("No call found");

		await screenshot(page, "callNotFound");
	});

	test("show error message when call data fetch fails", async ({ page }) => {
		mockRequest(
			page,
			() => getCall("kusama", { id_eq: callId }),
			(route) => route.fulfill({
				status: 200,
				body: JSON.stringify({
					errors: [{
						message: "Call error"
					}]
				})
			})
		);

		await navigate(page, `/kusama/call/${callId}`, {waitUntil: "data-loaded"});

		const errorMessage = page.getByTestId("error");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(/Unexpected error/);
		await expect(errorMessage).toHaveText(/Call error/);

		await screenshot(page, "callError");
	});

	test("show error message when events items fetch fails", async ({ page }) => {
		mockRequest(
			page,
			() => getEvents("kusama", 10, 0, { call: { id_eq: callId } }, "id_ASC"),
			(route) => route.fulfill({
				status: 200,
				body: JSON.stringify({
					errors: [{
						message: "Events error"
					}]
				})
			})
		);

		await navigate(page, `/kusama/call/${callId}`, {waitUntil: "data-loaded"});

		const errorMessage = page.getByTestId("error");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(/Unexpected error/);
		await expect(errorMessage).toHaveText(/Events error/);

		await screenshot(page, "callWithEventsError");
	});
});
