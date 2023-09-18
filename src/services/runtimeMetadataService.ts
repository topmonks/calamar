import { DecodedMetadata } from "../model/decodedMetadata";
import { runtimeSpecWorker } from "../workers/runtimeSpecWorker";

const metadataCache: Record<string, DecodedMetadata> = {};

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

export async function getRuntimeMetadata(network: string, specVersion: number|undefined): Promise<DecodedMetadata|undefined> {
	if (!specVersion) {
		return undefined;
	}

	// Ensure running a worker for obtaining runtime metadata only once at a time
	// because metadata decoding is memory-intensive operation and
	// could lead to webapp crash if run multiple times simultaneously.
	//
	// It also ensures the metadata are downloaded only once for a spec version per window
	await self.navigator.locks.request("get-runtime-metadata", async () => {
		if (!metadataCache[specVersion]) {
			const metadata = await runtimeSpecWorker.run({
				network,
				specVersion
			});

			if (metadata) {
				metadataCache[specVersion] = metadata;
			}
		}
	});

	return metadataCache[specVersion];
}
