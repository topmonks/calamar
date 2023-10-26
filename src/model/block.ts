import { Network } from "./network";

export type Block = {
	id: string;
	network: Network;
	hash: string;
	height: number;
	timestamp: string;
	parentHash: string;
	validator: string|null;
	specVersion: number;
}
