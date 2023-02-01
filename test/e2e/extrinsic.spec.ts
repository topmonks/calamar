import { mockRequest } from "../utils/mockRequest";
import { navigate } from "../utils/navigate";
import { test, expect } from "../utils/test";

test.describe("Extrinsic detail page", () => {
	const extrinsicId = "0014932897-000002-93378";

	test("shows extrinsic detail page with events", async ({ page, takeScreenshot }) => {
		await navigate(page, `/kusama/extrinsic/${extrinsicId}`, {waitUntil: "data-loaded"});

		await takeScreenshot("extrinsic-with-events");
	});

	test("shows extrinsic detail page with calls", async ({ page, takeScreenshot }) => {
		await navigate(page, `/kusama/extrinsic/${extrinsicId}`, {waitUntil: "data-loaded"});

		await page.getByTestId("calls-tab").click();

		await takeScreenshot("extrinsic-with-calls");
	});

	test("shows not found message if extrinsic was not found", async ({ page, takeScreenshot }) => {
		const id = "111-22-3";

		await navigate(page, `/kusama/extrinsic/${id}`, {waitUntil: "data-loaded"});

		const errorMessage = page.getByTestId("not-found");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText("No extrinsic found");

		await takeScreenshot("extrinsic-not-found");
	});

	test("show error message when item data fetch fails", async ({ page, takeScreenshot }) => {
		mockRequest(
			page,
			(request) => request.postData()?.match("extrinsic"),
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

		await takeScreenshot("extrinsic-error");
	});

	test("show error message when events items fetch fails", async ({ page, takeScreenshot }) => {
		mockRequest(
			page,
			(request) => request.postData()?.match("events"),
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

		await takeScreenshot("extrinsic-with-events-error");
	});

	test("show error message when calls items fetch fails", async ({ page, takeScreenshot }) => {
		mockRequest(
			page,
			(request) => request.postData()?.match("calls"),
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

		await takeScreenshot("extrinsic-with-calls-error");
	});
});
