import Decimal from "decimal.js";

export type Balance = {
	id: string;
	free: Decimal;
	reserved: Decimal;
	total: Decimal;
	updatedAtBlock?: number;
}
