import { Network } from "./network";
import { RuntimeMetadataCall } from "./runtime-metadata/runtimeMetadataCall";

export type Call = {
	id: string;
	network: Network;
	callName: string;
	palletName: string;
	blockId: string;
	blockHeight: number;
	timestamp: string;
	parentId: string|null;
	extrinsicId: string;
	caller: string|null;
	args: any|null;
	success: boolean;
	specVersion: string;
	metadata: {
		call?: RuntimeMetadataCall
	}
}
