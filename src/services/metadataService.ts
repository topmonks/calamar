import { getRuntimeMetadata } from "./runtimeSpecService";

export async function getRuntimeCallMetadata(network: string, specVersion: number, palletName: string, callName: string) {
	const metadata = await getRuntimeMetadata(network, specVersion);

	const pallet = metadata?.pallets.find(it => it.name.toLowerCase() === palletName.toLowerCase());
	const call = pallet?.calls.find(it => it.name.toLowerCase() === callName.toLowerCase());

	return call;
}

export async function getRuntimeEventMetadata(network: string, specVersion: number, palletName: string, eventName: string) {
	const metadata = await getRuntimeMetadata(network, specVersion);

	const pallet = metadata?.pallets.find(it => it.name.toLowerCase() === palletName.toLowerCase());
	const event = pallet?.events.find(it => it.name.toLowerCase() === eventName.toLowerCase());

	return event;
}
