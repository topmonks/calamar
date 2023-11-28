import { DecodedEvent } from "./decodedMetadata";
import { Network } from "./network";

export type Event = {
	id: string;
	network: Network;
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
