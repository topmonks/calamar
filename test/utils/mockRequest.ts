import { Page, Route } from "@playwright/test";

import { recordFetchRequest, RequestGenerator, RequestMatcher } from "./recordRequest";

export async function mockRequest(page: Page, requestGenerator: RequestGenerator, fulfill: (route: Route) => any, requestMatcher?: RequestMatcher) {
	const recordedRequest = await recordFetchRequest(requestGenerator, requestMatcher);

	await page.route("**/*", (route) => {
		const request = route.request();

		if (
			recordedRequest
			&& request.url() === recordedRequest[0]
			&& request.method() === recordedRequest[1].method
			&& request.postData() === recordedRequest[1].body
		) {
			fulfill(route);
		} else {
			route.continue();
		}
	});
}
