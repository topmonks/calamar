import { Page, Route } from "@playwright/test";

import { recordFetchRequest } from "./recordRequest";

export async function mockRequest(page: Page, requestGenerator: () => unknown|Promise<unknown>, fulfill: (route: Route) => any) {
	const recordedRequest = await recordFetchRequest(requestGenerator);

	await page.route("**/*", (route) => {
		const request = route.request();

		if (
			request.url() === recordedRequest[0]
			&& request.method() === recordedRequest[1].method
			&& request.postData() === recordedRequest[1].body
		) {
			fulfill(route);
		} else {
			route.continue();
		}
	});
}
