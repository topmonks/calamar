import { test, expect } from "@playwright/test";
import { getAccount } from "../../src/services/accountService";
import { getBlock } from "../../src/services/blocksService";
import { getEventsWithoutTotalCount } from "../../src/services/eventsService";
import { getExtrinsic, getExtrinsicsWithoutTotalCount } from "../../src/services/extrinsicsService";
import { mockRequest } from "../utils/mockRequest";

import { navigate } from "../utils/navigate";
import { removeContent } from "../utils/removeContent";
import { screenshot } from "../utils/screenshot";

test.describe("Search results page", () => {
	test("redirects to extrinsic if found by hash", async ({ page }) => {
		await navigate(page, "/equilibrium/search?query=0x162bd24c5f19b9fee4a33d11c2908d73d5b0d6c428cf0f1eecdf568c346b26b3", {waitUntil: "data-loaded"});
		await page.waitForURL(/\/equilibrium\/extrinsic\/0001116746-000033-e9bc2/);
	});

	test("redirects to block if found by hash", async ({ page }) => {
		await navigate(page, "/equilibrium/search?query=0xe9bc2f7f23685d545bfcb71ea59140700f83868300123fcb04f4872b18979242", {waitUntil: "data-loaded"});
		await page.waitForURL(/\/equilibrium\/block\/0001116746-e9bc2/);
	});

	test("redirects to block if found by height", async ({ page }) => {
		await navigate(page, "/equilibrium/search?query=1116746", {waitUntil: "data-loaded"});
		await page.waitForURL(/\/equilibrium\/block\/0001116746-e9bc2/);
	});

	test("redirects to account if found by raw address", async ({ page }) => {
		await navigate(page, "/equilibrium/search?query=0x84f4045c97be387e116aad02946aa3972e06a169847cf15532a182c075818b6f", {waitUntil: "data-loaded"});
		await page.waitForURL(/\/equilibrium\/account\/0x84f4045c97be387e116aad02946aa3972e06a169847cf15532a182c075818b6f/);
	});

	test("redirects to account if found by encoded address", async ({ page }) => {
		await navigate(page, "/equilibrium/search?query=cg67PjybUeaEXyDzybvVDj6zeojYfDQGFK5YBK5HJn55MmQZG", {waitUntil: "data-loaded"});
		await page.waitForURL(/\/equilibrium\/account\/0x84f4045c97be387e116aad02946aa3972e06a169847cf15532a182c075818b6f/);
	});

	test("shows found extrinsics by name", async ({ page }) => {
		await navigate(page, "/equilibrium/search?query=Oracle.set_price_unsigned", {waitUntil: "data-loaded"});

		await page.getByTestId("extrinsics-tab").isVisible();

		await removeContent(page.locator("[data-test=extrinsics-table] tr td"));
		await screenshot(page, "searchExtrinsicsByName");
	});

	test("shows found events by name", async ({ page }) => {
		await navigate(page, "/equilibrium/search?query=Oracle.NewPrice", {waitUntil: "data-loaded"});

		await page.getByTestId("events-tab").isVisible();

		await removeContent(page.locator("[data-test=events-table] tr td"));
		await screenshot(page, "searchEventsByName");
	});

	test("shows not found message if nothing was found by hash", async ({ page }) => {
		const query = "0x1234567890";

		await navigate(page, `/equilibrium/search?query=${query}`, {waitUntil: "data-loaded"});

		const errorMessage = page.getByTestId("not-found");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(`Nothing was found for query ${query}`);

		await screenshot(page, "searchNotFound");
	});

	test("shows not found message if nothing was found by height", async ({ page }) => {
		const query = "999999999";

		await navigate(page, `/equilibrium/search?query=${query}`, {waitUntil: "data-loaded"});

		const errorMessage = page.getByTestId("not-found");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(`Nothing was found for query ${query}`);
	});

	test("shows not found message if nothing was found by name", async ({ page }) => {
		const query = "dflkasdjf";

		await navigate(page, `/equilibrium/search?query=${query}`, {waitUntil: "data-loaded"});

		const errorMessage = page.getByTestId("not-found");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(`Nothing was found for query ${query}`);
	});

	test("shows error message when search for extrinsic by hash fails", async ({ page }) => {
		const hash = "0x162bd24c5f19b9fee4a33d11c2908d73d5b0d6c428cf0f1eecdf568c346b26b3";

		mockRequest(
			page,
			() => getExtrinsic("equilibrium", { hash_eq: hash }),
			(route) => route.fulfill({
				status: 200,
				body: JSON.stringify({
					errors: [{
						message: "Extrinsic search error"
					}]
				})
			})
		);

		await navigate(page, `/equilibrium/search?query=${hash}`, {waitUntil: "data-loaded"});

		const errorMessage = page.getByTestId("error");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(/Unexpected error/);
		await expect(errorMessage).toHaveText(new RegExp(hash));
		await expect(errorMessage).toHaveText(/Extrinsic search error/);

		await screenshot(page, "searchExtrinsicByHashError");
	});

	test("shows error message when search for block by hash fails", async ({ page }) => {
		const hash = "0xe9bc2f7f23685d545bfcb71ea59140700f83868300123fcb04f4872b18979242";

		mockRequest(
			page,
			() => getBlock("equilibrium", { hash_eq: hash }),
			(route) => route.fulfill({
				status: 200,
				body: JSON.stringify({
					errors: [{
						message: "Block search error"
					}]
				})
			})
		);

		await navigate(page, `/equilibrium/search?query=${hash}`, {waitUntil: "data-loaded"});

		const errorMessage = page.getByTestId("error");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(/Unexpected error/);
		await expect(errorMessage).toHaveText(new RegExp(hash));
		await expect(errorMessage).toHaveText(/Block search error/);

		await screenshot(page, "searchBlockByHashError");
	});

	test("shows error message when search for block by height fails", async ({ page }) => {
		const height = 123;

		mockRequest(
			page,
			() => getBlock("equilibrium", { height_eq: height }),
			(route) => route.fulfill({
				status: 200,
				body: JSON.stringify({
					errors: [{
						message: "Block search error"
					}]
				})
			})
		);

		await navigate(page, `/equilibrium/search?query=${height}`, {waitUntil: "data-loaded"});

		const errorMessage = page.getByTestId("error");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(/Unexpected error/);
		await expect(errorMessage).toHaveText(new RegExp(height.toString()));
		await expect(errorMessage).toHaveText(/Block search error/);

		await screenshot(page, "searchBlockByHeightError");
	});

	test("shows error message when search for account by raw address fails", async ({ page }) => {
		const address = "0x84f4045c97be387e116aad02946aa3972e06a169847cf15532a182c075818b6f";

		mockRequest(
			page,
			() => getAccount("equilibrium", address),
			(route) => route.fulfill({
				status: 200,
				body: JSON.stringify({
					errors: [{
						message: "Account search error"
					}]
				})
			})
		);

		await navigate(page, `/equilibrium/search?query=${address}`, {waitUntil: "data-loaded"});

		const errorMessage = page.getByTestId("error");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(/Unexpected error/);
		await expect(errorMessage).toHaveText(new RegExp(address));
		await expect(errorMessage).toHaveText(/Account search error/);

		await screenshot(page, "searchAccountByRawAddressError");
	});

	test("shows error message when search for account by encoded address fails", async ({ page }) => {
		const address = "cg67PjybUeaEXyDzybvVDj6zeojYfDQGFK5YBK5HJn55MmQZG";

		mockRequest(
			page,
			() => getAccount("equilibrium", address),
			(route) => route.fulfill({
				status: 200,
				body: JSON.stringify({
					errors: [{
						message: "Account search error"
					}]
				})
			})
		);

		await navigate(page, `/equilibrium/search?query=${address}`, {waitUntil: "data-loaded"});

		const errorMessage = page.getByTestId("error");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(/Unexpected error/);
		await expect(errorMessage).toHaveText(new RegExp(address));
		await expect(errorMessage).toHaveText(/Account search error/);

		await screenshot(page, "searchAccountByEncodedAddressError");
	});

	test("shows error message when search for extrinsics by name fails", async ({ page }) => {
		const name = "Oracle.set_price_unsigned";

		mockRequest(
			page,
			() => getExtrinsicsWithoutTotalCount("equilibrium", 10, 0, { call: { name_eq: name } }, "id_DESC"),
			(route) => route.fulfill({
				status: 200,
				body: JSON.stringify({
					errors: [{
						message: "Extrinsics search error"
					}]
				})
			})
		);

		await navigate(page, `/equilibrium/search?query=${name}`, {waitUntil: "data-loaded"});

		const errorMessage = page.getByTestId("error");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(/Unexpected error/);
		await expect(errorMessage).toHaveText(new RegExp(name));
		await expect(errorMessage).toHaveText(/Extrinsics search error/);

		await screenshot(page, "searchExtrinsicsByNameError");
	});

	test("shows error message when search for events by name fails", async ({ page }) => {
		const name = "Oracle.NewPrice";

		mockRequest(
			page,
			() => getEventsWithoutTotalCount("equilibrium", 10, 0, { name_eq: name }, "id_DESC"),
			(route) => route.fulfill({
				status: 200,
				body: JSON.stringify({
					errors: [{
						message: "Events search error"
					}]
				})
			})
		);

		await navigate(page, `/equilibrium/search?query=${name}`, {waitUntil: "data-loaded"});

		const errorMessage = page.getByTestId("error");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(/Unexpected error/);
		await expect(errorMessage).toHaveText(new RegExp(name));
		await expect(errorMessage).toHaveText(/Events search error/);

		await screenshot(page, "searchEventsByNameError");
	});

	test("shows error message in events tab when events search by name fails while searching for extrinsics by name", async ({ page }) => {
		const name = "Oracle.set_price_unsigned";

		mockRequest(
			page,
			() => getEventsWithoutTotalCount("equilibrium", 10, 0, { name_eq: name }, "id_DESC"),
			(route) => route.fulfill({
				status: 200,
				body: JSON.stringify({
					errors: [{
						message: "Events search error"
					}]
				})
			})
		);

		await navigate(page, `/equilibrium/search?query=${name}`, {waitUntil: "data-loaded"});

		await page.getByTestId("events-tab").click();

		const errorMessage = page.getByTestId("error");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(/Unexpected error/);
		await expect(errorMessage).toHaveText(/Events search error/);

		await screenshot(page, "searchExtrinsicsByNameWithEventsError");
	});

	test("shows error message in extrinsics tab when extrinsics search by name fails while searching for events by name", async ({ page }) => {
		const name = "Oracle.NewPrice";

		mockRequest(
			page,
			() => getExtrinsicsWithoutTotalCount("equilibrium", 10, 0, { call: { name_eq: name } }, "id_DESC"),
			(route) => route.fulfill({
				status: 200,
				body: JSON.stringify({
					errors: [{
						message: "Extrinsics search error"
					}]
				})
			})
		);

		await navigate(page, `/equilibrium/search?query=${name}`, {waitUntil: "data-loaded"});

		await page.getByTestId("extrinsics-tab").click();

		const errorMessage = page.getByTestId("error");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText(/Unexpected error/);
		await expect(errorMessage).toHaveText(/Extrinsics search error/);

		await screenshot(page, "searchEventsByNameWithExtrinsicsError");
	});
});
