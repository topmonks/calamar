import { runtimeMetadataRepository } from "../repositories/runtimeMetadataRepository";
import { RuntimeSpecWorker } from "../workers/runtimeSpecWorker";

export async function getPalletsRuntimeMetadata(network: string, specVersion: number) {
	await loadRuntimeMetadata(network, specVersion);
	return runtimeMetadataRepository.pallets.where({network, specVersion});
}

export async function getCallsRuntimeMetadata(network: string, specVersion: number, pallet: string) {
	await loadRuntimeMetadata(network, specVersion);
	return runtimeMetadataRepository.calls.where({network, specVersion, pallet});
}

export async function getEventsRuntimeMetadata(network: string, specVersion: number, pallet: string) {
	await loadRuntimeMetadata(network, specVersion);
	return runtimeMetadataRepository.events.where({network, specVersion, pallet});
}

export async function getCallRuntimeMetadata(network: string, specVersion: number, pallet: string, name: string) {
	await loadRuntimeMetadata(network, specVersion);
	return await runtimeMetadataRepository.calls.get({network, specVersion, pallet, name});
}

export async function getRuntimeEventMetadata(network: string, specVersion: number, pallet: string, name: string) {
	await loadRuntimeMetadata(network, specVersion);
	return await runtimeMetadataRepository.events.get({network, specVersion, pallet, name});
}

/*** PRIVATE ***/

export async function loadRuntimeMetadata(network: string, specVersion: number) {
	await self.navigator.locks.request(`runtime-metadata/${network}/${specVersion}`, async () => {
		const spec = await runtimeMetadataRepository.specs.get([network, specVersion]);

		if (spec) {
			console.log("metadata already downloaded", network, specVersion);
			return;
		}

		console.log("downloading metadata", network, specVersion);

		const worker = new RuntimeSpecWorker();
		await worker.loadMetadata(network, specVersion);

		worker.terminate();
	});
}
