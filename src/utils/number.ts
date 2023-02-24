import Decimal from "decimal.js";

export function formatNumber(value: number|string|Decimal) {
	if (value instanceof Decimal) {
		value = value.toString();
	}

	return value.toLocaleString("en-US", {maximumFractionDigits: 20});
}
