import { Network } from "./network";
import { RuntimeMetadataCall } from "./runtime-metadata/runtimeMetadataCall";

export type Extrinsic = {
	id: string;
	network: Network;
	hash: string;
	blockId: string;
	blockHeight: number;
	callName: string;
	palletName: string;
	args: object|null;
	timestamp: string;
	signer: string|null;
	signature: string|null;
	indexInBlock: number;
	success: boolean;
	tip: bigint|null;
	fee: bigint|null;
	error: object|null;
	version: number;
	specVersion: string;
	metadata: {
		call?: RuntimeMetadataCall,
		// TODO error?: any
	}
}
