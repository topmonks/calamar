import { mockRequest } from "../utils/mockRequest";

import { navigate } from "../utils/navigate";
import { removeContent } from "../utils/removeContent";
import { test, expect } from "../utils/test";

test.describe("Search results page", () => {
	test("redirects to extrinsic if found by hash", async ({ page, takeScreenshot }) => {
		await navigate(page, "/kusama/search?query=0xf80034290dc9e3c251b883082598f4395ee7c751ca7cc8a4691256e567a437b6", {waitUntil: "data-loaded"});
		await page.waitForURL(/\/kusama\/extrinsic\/0001116746-000000-9f802/);
	});

	test("redirects to block if found by hash", async ({ page, takeScreenshot }) => {
		await navigate(page, "/kusama/search?query=0x9f8022bee8d4b97084eb0f5cd5e2c33834f11506f24443f17802c7df789a1fe0", {waitUntil: "data-loaded"});
		await page.waitForURL(/\/kusama\/block\/0001116746-9f802/);
	});

	test("redirects to block if found by height", async ({ page, takeScreenshot }) => {
		await navigate(page, "/kusama/search?query=1116746", {waitUntil: "data-loaded"});
		await page.waitForURL(/\/kusama\/block\/0001116746-9f802/);
	});

	test("redirects to account if found by public key", async ({ page, takeScreenshot }) => {
		await navigate(page, "/kusama/search?query=0x701edf7baf18532d871b65666416404861faab1d1fcca9241efba6d8cf5f4509", {waitUntil: "data-loaded"});
		await page.waitForURL(/\/kusama\/account\/F7L3yPqrmHtDQd1Ry4w6pXL7Fxpoa1G6VWLSNGa9RwQKNWJ/);
	});

	test("redirects to account if found by encoded address", async ({ page, takeScreenshot }) => {
		await navigate(page, "/kusama/search?query=F7L3yPqrmHtDQd1Ry4w6pXL7Fxpoa1G6VWLSNGa9RwQKNWJ", {waitUntil: "data-loaded"});
		await page.waitForURL(/\/kusama\/account\/F7L3yPqrmHtDQd1Ry4w6pXL7Fxpoa1G6VWLSNGa9RwQKNWJ/);
	});

	test("shows found extrinsics by name", async ({ page, takeScreenshot }) => {
		await navigate(page, "/kusama/search?query=balances.transfer", {waitUntil: "data-loaded"});

		await page.getByTestId("extrinsics-tab").click();

		await removeContent(page.locator("[data-test=extrinsics-table] tr td"));
		await takeScreenshot("search-extrinsics-by-name");
	});

	test("shows found extrinsics by pallet name", async ({ page, takeScreenshot }) => {
		await navigate(page, "/kusama/search?query=balances", {waitUntil: "data-loaded"});

		await page.getByTestId("extrinsics-tab").click();

		await removeContent(page.locator("[data-test=extrinsics-table] tr td"));
		await takeScreenshot("search-extrinsics-by-pallet-name");
	});

	test("shows found events by name", async ({ page, takeScreenshot }) => {
		await navigate(page, "/kusama/search?query=balances.transfer", {waitUntil: "data-loaded"});

		await page.getByTestId("events-tab").click();

		await removeContent(page.locator("[data-test=events-table] tr td"));
		await takeScreenshot("search-events-by-name");
	});

	test("shows found events by pallet name", async ({ page, takeScreenshot }) => {
		await navigate(page, "/kusama/search?query=balances", {waitUntil: "data-loaded"});

		await page.getByTestId("events-tab").click();

		await removeContent(page.locator("[data-test=events-table] tr td"));
		await takeScreenshot("search-events-by-pallet-name");
	});

	test("shows not found message if nothing was found by hash", async ({ page, takeScreenshot }) => {
		const query = "0x123456789";

		await navigate(page, `/kusama/search?query=${query}`, {waitUntil: "data-loaded"});

		const errorMessage = page.getByTestId("not-found");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(`Nothing was found for query ${query}`);

		await takeScreenshot("search-not-found");
	});

	test("shows not found message if nothing was found by height", async ({ page, takeScreenshot }) => {
		const query = "999999999";

		await navigate(page, `/kusama/search?query=${query}`, {waitUntil: "data-loaded"});

		const errorMessage = page.getByTestId("not-found");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(`Nothing was found for query ${query}`);
	});

	test("shows not found message if nothing was found by name", async ({ page, takeScreenshot }) => {
		const query = "balances.non_existing_call";

		await navigate(page, `/kusama/search?query=${query}`, {waitUntil: "data-loaded"});

		const errorMessage = page.getByTestId("not-found");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(`Nothing was found for query ${query}`);
	});

	test("shows error message when search for extrinsic by hash fails", async ({ page, takeScreenshot }) => {
		const hash = "0x162bd24c5f19b9fee4a33d11c2908d73d5b0d6c428cf0f1eecdf568c346b26";

		mockRequest(
			page,
			(request) => request.postData()?.match("extrinsic"),
			(route) => route.fulfill({
				status: 200,
				body: JSON.stringify({
					errors: [{
						message: "Extrinsic search error"
					}]
				})
			})
		);

		await navigate(page, `/kusama/search?query=${hash}`, {waitUntil: "data-loaded"});

		const errorMessage = page.getByTestId("error");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(/Unexpected error/);
		await expect(errorMessage).toHaveText(new RegExp(hash));
		await expect(errorMessage).toHaveText(/Extrinsic search error/);

		await takeScreenshot("search-extrinsic-by-hash-error");
	});

	test("shows error message when search for block by hash fails", async ({ page, takeScreenshot }) => {
		const hash = "0xe9bc2f7f23685d545bfcb71ea59140700f83868300123fcb04f4872b189742";

		mockRequest(
			page,
			(request) => request.postData()?.match("block"),
			(route) => route.fulfill({
				status: 200,
				body: JSON.stringify({
					errors: [{
						message: "Block search error"
					}]
				})
			})
		);

		await navigate(page, `/kusama/search?query=${hash}`, {waitUntil: "data-loaded"});

		const errorMessage = page.getByTestId("error");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(/Unexpected error/);
		await expect(errorMessage).toHaveText(new RegExp(hash));
		await expect(errorMessage).toHaveText(/Block search error/);

		await takeScreenshot("search-block-by-hash-error");
	});

	test("shows error message when search for block by height fails", async ({ page, takeScreenshot }) => {
		const height = 123;

		mockRequest(
			page,
			(request) => request.postData()?.match("block"),
			(route) => route.fulfill({
				status: 200,
				body: JSON.stringify({
					errors: [{
						message: "Block search error"
					}]
				})
			})
		);

		await navigate(page, `/kusama/search?query=${height}`, {waitUntil: "data-loaded"});

		const errorMessage = page.getByTestId("error");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(/Unexpected error/);
		await expect(errorMessage).toHaveText(new RegExp(height.toString()));
		await expect(errorMessage).toHaveText(/Block search error/);

		await takeScreenshot("search-block-by-height-error");
	});

	test("shows error message when search for extrinsics by name fails", async ({ page, takeScreenshot }) => {
		const name = "Timestamp.set";

		mockRequest(
			page,
			(request) => request.postData()?.match("extrinsicsConnection"),
			(route) => route.fulfill({
				status: 200,
				body: JSON.stringify({
					errors: [{
						message: "Extrinsics search error"
					}]
				})
			})
		);

		await navigate(page, `/kusama/search?query=${name}`, {waitUntil: "data-loaded"});

		const errorMessage = page.getByTestId("error");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(/Unexpected error/);
		await expect(errorMessage).toHaveText(new RegExp(name));
		await expect(errorMessage).toHaveText(/Extrinsics search error/);

		await takeScreenshot("search-extrinsics-by-name-error");
	});

	test("shows error message when search for events by name fails", async ({ page, takeScreenshot }) => {
		const name = "System.ExtrinsicSuccess";

		mockRequest(
			page,
			(request) => request.postData()?.match("eventsConnection"),
			(route) => route.fulfill({
				status: 200,
				body: JSON.stringify({
					errors: [{
						message: "Events search error"
					}]
				})
			})
		);

		await navigate(page, `/kusama/search?query=${name}`, {waitUntil: "data-loaded"});

		const errorMessage = page.getByTestId("error");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(/Unexpected error/);
		await expect(errorMessage).toHaveText(new RegExp(name));
		await expect(errorMessage).toHaveText(/Events search error/);

		await takeScreenshot("search-events-by-name-error");
	});

	test("shows error message in events tab when events search by name fails while searching for extrinsics by name", async ({ page, takeScreenshot }) => {
		const extrinsicsName = "Balances.transfer";

		mockRequest(
			page,
			(request) => request.postData()?.match("eventsConnection"),
			(route) => route.fulfill({
				status: 200,
				body: JSON.stringify({
					errors: [{
						message: "Events search error"
					}]
				})
			}),
		);

		await navigate(page, `/kusama/search?query=${extrinsicsName}`, {waitUntil: "data-loaded"});

		await page.getByTestId("events-tab").click();

		const errorMessage = page.getByTestId("error");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(/Unexpected error/);
		await expect(errorMessage).toHaveText(/Events search error/);

		await takeScreenshot("search-extrinsics-by-name-with-events-error");
	});

	test("shows error message in extrinsics tab when extrinsics search by name fails while searching for events by name", async ({ page, takeScreenshot }) => {
		const eventName = "Balances.Transfer";

		mockRequest(
			page,
			(request) => request.postData()?.match("extrinsicsConnection"),
			(route) => route.fulfill({
				status: 200,
				body: JSON.stringify({
					errors: [{
						message: "Extrinsics search error"
					}]
				})
			}),
		);

		await navigate(page, `/kusama/search?query=${eventName}`, {waitUntil: "data-loaded"});

		await page.getByTestId("extrinsics-tab").click();

		const errorMessage = page.getByTestId("error");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(/Unexpected error/);
		await expect(errorMessage).toHaveText(/Extrinsics search error/);

		await takeScreenshot("search-events-by-name-with-extrinsics-error");
	});
});
