import { DecodedMetadata } from "./decodedMetadata";

export type RuntimeSpec = {
	id: string;
	blockHash: string;
	blockHeight: number;
	specName: string;
	specVersion: number;
	hex: `0x${string}`;
	metadata: DecodedMetadata;
}
