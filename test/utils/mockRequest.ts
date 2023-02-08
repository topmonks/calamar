import { Page, Request, Route } from "@playwright/test";

export async function mockRequest(page: Page, requestMatcher: (request: Request) => boolean|any, fulfill: (route: Route) => any) {
	await page.route("**/*", (route) => {
		const request = route.request();

		if (requestMatcher(request)) {
			fulfill(route);
		} else {
			route.continue();
		}
	});
}
