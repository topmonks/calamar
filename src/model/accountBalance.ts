import Decimal from "decimal.js";

export type AccountBalance = {
	id: string;
	network: string;
	encodedAddress?: string;
	ss58prefix?: number;
	chainDecimals?: number;
	chainToken?: string;
	balanceSupported: boolean;
	balance?: {
		free: Decimal;
		reserved: Decimal;
		total: Decimal;
		updatedAt?: number;
	};
	error?: any;
}
