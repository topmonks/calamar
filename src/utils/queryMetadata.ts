import { DecodedMetadata } from "../model/decodedMetadata";

export function getCallMetadataByName(metadata: DecodedMetadata, name: string) {
	const [palletName, callName] = name.toLowerCase().split(".");

	const pallet = metadata.pallets.find(it => it.name.toLowerCase() === palletName);
	const call = pallet?.calls.find(it => it.name.toLowerCase() === callName);

	return call;
}

export function getEventMetadataByName(metadata: DecodedMetadata, name: string) {
	const [palletName, eventName] = name.toLowerCase().split(".");

	const pallet = metadata.pallets.find(it => it.name.toLowerCase() === palletName);
	const event = pallet?.events.find(it => it.name.toLowerCase() === eventName);

	return event;
}
