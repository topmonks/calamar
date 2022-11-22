import { getBlock } from "../../src/services/blocksService";
import { getExtrinsics } from "../../src/services/extrinsicsService";
import { getEvents } from "../../src/services/eventsService";
import { getCalls } from "../../src/services/callsService";

import { mockRequest } from "../utils/mockRequest";
import { navigate } from "../utils/navigate";
import { test, expect } from "../utils/test";

test.describe("Block detail page", () => {
	const blockId = "0014932897-93378";

	test("shows block detail page with extrinsics", async ({ page, takeScreenshot }) => {
		await navigate(page, `/kusama/block/${blockId}`, {waitUntil: "data-loaded"});

		await takeScreenshot("block-with-extrinsics");
	});

	test("shows block detail page with calls", async ({ page, takeScreenshot }) => {
		await navigate(page, `/kusama/block/${blockId}`, {waitUntil: "data-loaded"});

		await page.getByTestId("calls-tab").click();

		await takeScreenshot("block-with-calls");
	});

	test("shows block detail page with events", async ({ page, takeScreenshot }) => {
		await navigate(page, `/kusama/block/${blockId}`, {waitUntil: "data-loaded"});

		await page.getByTestId("events-tab").click();

		await takeScreenshot("block-with-events");
	});

	test("shows not found message if block was not found", async ({ page, takeScreenshot }) => {
		const id = "111-22-3";

		await navigate(page, `/kusama/block/${id}`, {waitUntil: "data-loaded"});

		const errorMessage = page.getByTestId("not-found");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText("No block found");

		await takeScreenshot("block-not-found");
	});

	test("show error message when block data fetch fails", async ({ page, takeScreenshot }) => {
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

		await takeScreenshot("block-error");
	});

	test("show error message when extrinsics items fetch fails", async ({ page, takeScreenshot }) => {
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

		await takeScreenshot("block-with-extrinsics-error");
	});

	test("show error message when calls items fetch fails", async ({ page, takeScreenshot }) => {
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

		await takeScreenshot("block-with-calls-error");
	});

	test("show error message when events items fetch fails", async ({ page, takeScreenshot }) => {
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

		await takeScreenshot("block-with-events-error");
	});
});
