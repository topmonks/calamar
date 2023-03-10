import { RuntimeSpec } from "./runtimeSpec";

export type Transfer = {
	id: string;
	direction: string;
	accountPublicKey: string;
	blockNumber: number;
	timestamp: string;
	extrinsicHash: string;
	fromPublicKey: string;
	toPublicKey: string;
	amount: number;
	success: boolean;
	runtimeSpec: RuntimeSpec;
}