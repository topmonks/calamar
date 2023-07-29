import Decimal from "decimal.js";

export type Balance = {
	free: Decimal;
	reserved: Decimal;
	total: Decimal;
}
