import Decimal from "decimal.js";

export type Transfer = {
	id: string;
	direction: string;
	accountPublicKey: string;
	blockNumber: number;
	timestamp: string;
	extrinsicHash: string|null;
	fromPublicKey: string;
	toPublicKey: string;
	amount: Decimal;
	success: boolean;
	extrinsic: {
		id: string;
	} | null;
}
