import { Locator } from "@playwright/test";

export async function removeContent(locator: Locator) {
	await locator.first().waitFor();
	await locator.evaluateAll((els) =>
		els.forEach((el) => el.innerHTML = "&nbsp;")
	);
}
