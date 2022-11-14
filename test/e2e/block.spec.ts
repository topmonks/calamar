import { test, expect } from "@playwright/test";

import { getBlock } from "../../src/services/blocksService";
import { getExtrinsics } from "../../src/services/extrinsicsService";
import { getEvents } from "../../src/services/eventsService";
import { getCalls } from "../../src/services/callsService";

import { mockRequest } from "../utils/mockRequest";
import { screenshot } from "../utils/screenshot";
import { waitForPageEvent } from "../utils/waitForPageEvent";
import { navigate } from "../utils/navigate";

test.describe("Block detail page", () => {
	const blockId = "0014932897-93378";

	test("shows block detail page with extrinsics", async ({ page }) => {
		await navigate(page, `/kusama/block/${blockId}`, {waitUntil: "data-loaded"});

		await screenshot(page, "blockWithExtrinsics");
	});

	test("shows block detail page with calls", async ({ page }) => {
		await navigate(page, `/kusama/block/${blockId}`, {waitUntil: "data-loaded"});

		await page.getByTestId("calls-tab").click();

		await screenshot(page, "blockWithCalls");
	});

	test("shows block detail page with events", async ({ page }) => {
		await navigate(page, `/kusama/block/${blockId}`, {waitUntil: "data-loaded"});

		await page.getByTestId("events-tab").click();

		await screenshot(page, "blockWithEvents");
	});

	test("show error message when block data fetch fails", async ({ page }) => {
		mockRequest(
			page,
			() => getBlock("kusama", {id_eq: blockId}),
			(route) => route.fulfill({
				status: 200,
				body: JSON.stringify({
					errors: [{
						message: "Block error"
					}]
				})
			})
		);

		await navigate(page, `/kusama/block/${blockId}`, {waitUntil: "data-loaded"});

		const errorMessage = page.getByTestId("error");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(/Unexpected error/);
		await expect(errorMessage).toHaveText(/Block error/);

		await screenshot(page, "blockError");
	});

	test("show error message when extrinsics items fetch fails", async ({ page }) => {
		mockRequest(
			page,
			() => getExtrinsics("kusama", 10, 0, { block: { id_eq: blockId } }, "id_DESC"),
			(route) => route.fulfill({
				status: 200,
				body: JSON.stringify({
					errors: [{
						message: "Extrinsics error"
					}]
				})
			})
		);

		await navigate(page, `/kusama/block/${blockId}`, {waitUntil: "data-loaded"});

		const errorMessage = page.getByTestId("error");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(/Unexpected error/);
		await expect(errorMessage).toHaveText(/Extrinsics error/);

		await screenshot(page, "blockWithExtrinsicsError");
	});

	test("show error message when calls items fetch fails", async ({ page }) => {
		mockRequest(
			page,
			() => getCalls("kusama", 10, 0, { block: { id_eq: blockId } }, "id_DESC"),
			(route) => route.fulfill({
				status: 200,
				body: JSON.stringify({
					errors: [{
						message: "Calls error"
					}]
				})
			})
		);

		await navigate(page, `/kusama/block/${blockId}`, {waitUntil: "data-loaded"});

		await page.getByTestId("calls-tab").click();

		const errorMessage = page.getByTestId("error");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(/Unexpected error/);
		await expect(errorMessage).toHaveText(/Calls error/);

		await screenshot(page, "blockWithCallsError");
	});

	test("show error message when events items fetch fails", async ({ page }) => {
		mockRequest(
			page,
			() => getEvents("kusama", 10, 0, { block: { id_eq: blockId } }, "id_DESC"),
			(route) => route.fulfill({
				status: 200,
				body: JSON.stringify({
					errors: [{
						message: "Events error"
					}]
				})
			})
		);

		await navigate(page, `/kusama/block/${blockId}`, {waitUntil: "data-loaded"});

		await page.getByTestId("events-tab").click();

		const errorMessage = page.getByTestId("error");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(/Unexpected error/);
		await expect(errorMessage).toHaveText(/Events error/);

		await screenshot(page, "blockWithEventsError");
	});
});
