import Decimal from "decimal.js";

import { RuntimeSpec } from "./runtimeSpec";

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
	runtimeSpec: RuntimeSpec;
	extrinsic: {
		id: string;
	} | null;
}
