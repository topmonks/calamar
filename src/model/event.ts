import { Network } from "./network";
import { RuntimeMetadataEvent } from "./runtime-metadata/runtimeMetadataEvent";

export type Event = {
	id: string;
	network: Network;
	eventName: string;
	palletName: string;
	blockId: string;
	blockHeight: number;
	timestamp: string;
	specVersion: string;
	extrinsicId: string|null;
	callId: string|null;
	args: any|null;
	metadata: {
		event?: RuntimeMetadataEvent
	}
}
