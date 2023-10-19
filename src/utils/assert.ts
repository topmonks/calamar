import { rollbar } from "../rollbar";

export function warningAssert(condition: any, data?: any) {
	if (!condition) {
		console.warn("Assert failed", data);
		rollbar.warning("Assert failed", data);
	}
}
