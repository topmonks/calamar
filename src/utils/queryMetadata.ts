import { DecodedMetadata } from "../model/decodedMetadata";

export function getCallMetadataByName(metadata: DecodedMetadata, palletName: string, callName: string) {
	const pallet = metadata.pallets.find(it => it.name.toLowerCase() === palletName);
	const call = pallet?.calls.find(it => it.name.toLowerCase() === callName);

	return call;
}

export function getEventMetadataByName(metadata: DecodedMetadata, palletName: string, eventName: string) {
	const pallet = metadata.pallets.find(it => it.name.toLowerCase() === palletName);
	const event = pallet?.events.find(it => it.name.toLowerCase() === eventName);

	return event;
}
