import { test, expect } from "@playwright/test";

import { getExtrinsic } from "../../src/services/extrinsicsService";
import { getEvents } from "../../src/services/eventsService";
import { getCalls } from "../../src/services/callsService";

import { mockRequest } from "../utils/mockRequest";
import { screenshot } from "../utils/screenshot";
import { waitForPageEvent } from "../utils/waitForPageEvent";
import { navigate } from "../utils/navigate";

test.describe("Extrinsic detail page", () => {
	const extrinsicId = "0014932897-000002-93378";

	test("shows extrinsic detail page with events", async ({ page }) => {
		await navigate(page, `/kusama/extrinsic/${extrinsicId}`, {waitUntil: "data-loaded"});

		await screenshot(page, "extrinsicWithEvents");
	});


	test("shows extrinsic detail page with calls", async ({ page }) => {
		await navigate(page, `/kusama/extrinsic/${extrinsicId}`, {waitUntil: "data-loaded"});

		await page.getByTestId("calls-tab").click();

		await screenshot(page, "extrinsicWithCalls");
	});

	test("show error message when item data fetch fails", async ({ page }) => {
		mockRequest(
			page,
			() => getExtrinsic("kusama", {id_eq: extrinsicId}),
			(route) => route.fulfill({
				status: 200,
				body: JSON.stringify({
					errors: [{
						message: "Extrinsic error"
					}]
				})
			})
		);

		await navigate(page, `/kusama/extrinsic/${extrinsicId}`, {waitUntil: "data-loaded"});

		const errorMessage = page.getByTestId("error");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(/Unexpected error/);
		await expect(errorMessage).toHaveText(/Extrinsic error/);

		await screenshot(page, "extrinsicError");
	});

	test("show error message when events items fetch fails", async ({ page }) => {
		mockRequest(
			page,
			() => getEvents("kusama", 10, 0, { extrinsic: { id_eq: extrinsicId } }, "id_ASC"),
			(route) => route.fulfill({
				status: 200,
				body: JSON.stringify({
					errors: [{
						message: "Events error"
					}]
				})
			})
		);

		await navigate(page, `/kusama/extrinsic/${extrinsicId}`, {waitUntil: "data-loaded"});

		const errorMessage = page.getByTestId("error");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(/Unexpected error/);
		await expect(errorMessage).toHaveText(/Events error/);

		await screenshot(page, "extrinsicWithEventsError");
	});

	test("show error message when calls items fetch fails", async ({ page }) => {
		mockRequest(
			page,
			() => getCalls("kusama", 10, 0, { extrinsic: { id_eq: extrinsicId } }, "id_ASC"),
			(route) => route.fulfill({
				status: 200,
				body: JSON.stringify({
					errors: [{
						message: "Calls error"
					}]
				})
			})
		);

		await navigate(page, `/kusama/extrinsic/${extrinsicId}`, {waitUntil: "data-loaded"});

		await page.getByTestId("calls-tab").click();

		const errorMessage = page.getByTestId("error");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(/Unexpected error/);
		await expect(errorMessage).toHaveText(/Calls error/);

		await screenshot(page, "extrinsicWithCallsError");
	});
});
