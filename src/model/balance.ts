import Decimal from "decimal.js";

import { RuntimeSpec } from "./runtimeSpec";

export type Balance = {
	id: string;
	free: Decimal;
	reserved: Decimal;
	total: Decimal;
	updatedAtBlock?: number;
	runtimeSpec: RuntimeSpec;
}
