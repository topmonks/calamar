import { getAccount } from "../../src/services/accountService";
import { getBlock } from "../../src/services/blocksService";
import { getEventsWithoutTotalCount } from "../../src/services/eventsService";
import { getExtrinsic, getExtrinsicsWithoutTotalCount } from "../../src/services/extrinsicsService";
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
		await page.waitForURL(/\/kusama\/account\/0x701edf7baf18532d871b65666416404861faab1d1fcca9241efba6d8cf5f4509/);
	});

	test("redirects to account if found by encoded address", async ({ page, takeScreenshot }) => {
		await navigate(page, "/kusama/search?query=F7L3yPqrmHtDQd1Ry4w6pXL7Fxpoa1G6VWLSNGa9RwQKNWJ", {waitUntil: "data-loaded"});
		await page.waitForURL(/\/kusama\/account\/0x701edf7baf18532d871b65666416404861faab1d1fcca9241efba6d8cf5f4509/);
	});

	test("shows found extrinsics by name", async ({ page, takeScreenshot }) => {
		await navigate(page, "/kusama/search?query=balances.transfer", {waitUntil: "data-loaded"});

		await page.getByTestId("extrinsics-tab").click();

		await removeContent(page.locator("[data-test=extrinsics-table] tr td"));
		await takeScreenshot("search-extrinsics-by-name");
	});

	test("shows found events by name", async ({ page, takeScreenshot }) => {
		await navigate(page, "/kusama/search?query=balances.transfer", {waitUntil: "data-loaded"});

		await page.getByTestId("events-tab").click();

		await removeContent(page.locator("[data-test=events-table] tr td"));
		await takeScreenshot("search-events-by-name");
	});

	test("shows not found message if nothing was found by hash", async ({ page, takeScreenshot }) => {
		const query = "0x1234567890";

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
		const hash = "0x162bd24c5f19b9fee4a33d11c2908d73d5b0d6c428cf0f1eecdf568c346b26b3";

		mockRequest(
			page,
			() => getExtrinsic("kusama", { hash_eq: hash }),
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
		const hash = "0xe9bc2f7f23685d545bfcb71ea59140700f83868300123fcb04f4872b18979242";

		mockRequest(
			page,
			() => getBlock("kusama", { hash_eq: hash }),
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
			() => getBlock("kusama", { height_eq: height }),
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

	test("shows error message when search for account by raw address fails", async ({ page, takeScreenshot }) => {
		const address = "0x84f4045c97be387e116aad02946aa3972e06a169847cf15532a182c075818b6f";

		mockRequest(
			page,
			() => getAccount("kusama", address),
			(route) => route.fulfill({
				status: 200,
				body: JSON.stringify({
					errors: [{
						message: "Account search error"
					}]
				})
			})
		);

		await navigate(page, `/kusama/search?query=${address}`, {waitUntil: "data-loaded"});

		const errorMessage = page.getByTestId("error");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(/Unexpected error/);
		await expect(errorMessage).toHaveText(new RegExp(address));
		await expect(errorMessage).toHaveText(/Account search error/);

		await takeScreenshot("search-account-by-raw-address-error");
	});

	test("shows error message when search for account by encoded address fails", async ({ page, takeScreenshot }) => {
		const address = "cg67PjybUeaEXyDzybvVDj6zeojYfDQGFK5YBK5HJn55MmQZG";

		mockRequest(
			page,
			() => getAccount("kusama", address),
			(route) => route.fulfill({
				status: 200,
				body: JSON.stringify({
					errors: [{
						message: "Account search error"
					}]
				})
			})
		);

		await navigate(page, `/kusama/search?query=${address}`, {waitUntil: "data-loaded"});

		const errorMessage = page.getByTestId("error");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(/Unexpected error/);
		await expect(errorMessage).toHaveText(new RegExp(address));
		await expect(errorMessage).toHaveText(/Account search error/);

		await takeScreenshot("search-account-by-encoded-address-error");
	});

	test("shows error message when search for extrinsics by name fails", async ({ page, takeScreenshot }) => {
		const name = "Timestamp.set";

		mockRequest(
			page,
			() => getExtrinsicsWithoutTotalCount("kusama", 10, 0, { call: { name_eq: name } }, "id_DESC"),
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
			() => getEventsWithoutTotalCount("kusama", 10, 0, { name_eq: name }, "id_DESC"),
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
		const eventName = "Balances.Transfer";

		mockRequest(
			page,
			() => getEventsWithoutTotalCount("kusama", 10, 0, { name_eq: eventName }, "id_DESC"),
			(route) => route.fulfill({
				status: 200,
				body: JSON.stringify({
					errors: [{
						message: "Events search error"
					}]
				})
			})
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
		const extrinsicsName = "Balances.transfer";

		mockRequest(
			page,
			() => getExtrinsicsWithoutTotalCount("kusama", 10, 0, { call: { name_eq: extrinsicsName } }, "id_DESC"),
			(route) => route.fulfill({
				status: 200,
				body: JSON.stringify({
					errors: [{
						message: "Extrinsics search error"
					}]
				})
			})
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
