import Decimal from "decimal.js";

import { Network } from "./network";

export type Balance = {
	free: Decimal;
	reserved: Decimal;
	total: Decimal;
	updatedAt?: number;
}

export type AccountBalance = {
	id: string;
	network: Network;
	encodedAddress?: string;
	balanceSupported: boolean;
	balance?: Balance;
	error?: any;
}
