import Decimal from "decimal.js";

import { Network } from "./network";

export type AccountBalance = {
	id: string;
	network: Network;
	encodedAddress?: string;
	balanceSupported: boolean;
	balance?: {
		free: Decimal;
		reserved: Decimal;
		total: Decimal;
		updatedAt?: number;
	};
	error?: any;
}
