import { DecodedEvent } from "./decodedMetadata";

export type Event = {
	id: string;
	network: string;
	eventName: string;
	palletName: string;
	blockId: string;
	blockHeight: number;
	timestamp: string;
	specVersion: number;
	extrinsicId: string|null;
	callId: string|null;
	args: any|null;
	metadata: {
		event?: DecodedEvent
	}
}
