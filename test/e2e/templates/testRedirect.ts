import { navigate } from "../../utils/navigate";

import { test } from "../../test";

export function testRedirect(description: string, fromUrl: string, toUrl: string) {
	test(description, async ({ page }) => {
		await navigate(page, fromUrl);
		await page.waitForURL((url: URL) => !!url.toString().match(toUrl));
	});
}
