import { DecodedCall } from "./decodedMetadata";

export type Call = {
	id: string;
	network: string;
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
	specVersion: number;
	metadata: {
		call?: DecodedCall
	}
}
