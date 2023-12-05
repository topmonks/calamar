import { Table } from "dexie";

import { Network } from "../model/network";
import { RuntimeMetadataCall } from "../model/runtime-metadata/runtimeMetadataCall";
import { RuntimeMetadataPallet } from "../model/runtime-metadata/runtimeMetadataPallet";
import { RuntimeMetadataEvent } from "../model/runtime-metadata/runtimeMetadataEvent";
import { RuntimeMetadataConstant } from "../model/runtime-metadata/runtimeMetadataConstant";
import { RuntimeMetadataStorage } from "../model/runtime-metadata/runtimeMetadataStorage";
import { RuntimeMetadataError } from "../model/runtime-metadata/runtimeMetadataError";

import { runtimeMetadataRepository } from "../repositories/runtimeMetadataRepository";

import { lowerFirst, upperFirst } from "../utils/string";

import { RuntimeSpecWorker } from "../workers/runtimeSpecWorker";

export async function getRuntimeMetadataPallets(network: string, specVersion: string, filter?: (it: RuntimeMetadataPallet) => boolean) {
	await loadRuntimeMetadata(network, specVersion);
	return queryStore(runtimeMetadataRepository.pallets, {network, specVersion}, filter).toArray();
}

export async function getRuntimeMetadataCalls(network: string, specVersion: string, pallet: string, filter?: (it: RuntimeMetadataCall) => boolean) {
	await loadRuntimeMetadata(network, specVersion);
	return queryStore(runtimeMetadataRepository.calls, {network, specVersion, pallet}, filter).toArray();
}

export async function getRuntimeMetadataEvents(network: string, specVersion: string, pallet: string, filter?: (it: RuntimeMetadataEvent) => boolean) {
	await loadRuntimeMetadata(network, specVersion);
	return queryStore(runtimeMetadataRepository.events, {network, specVersion, pallet}, filter).toArray();
}

export async function getRuntimeMetadataConstants(network: string, specVersion: string, pallet: string, filter?: (it: RuntimeMetadataConstant) => boolean) {
	await loadRuntimeMetadata(network, specVersion);
	return queryStore(runtimeMetadataRepository.constants, {network, specVersion, pallet}, filter).toArray();
}

export async function getRuntimeMetadataStorages(network: string, specVersion: string, pallet: string, filter?: (it: RuntimeMetadataStorage) => boolean) {
	await loadRuntimeMetadata(network, specVersion);
	return queryStore(runtimeMetadataRepository.storages, {network, specVersion, pallet}, filter).toArray();
}

export async function getRuntimeMetadataErrors(network: string, specVersion: string, pallet: string, filter?: (it: RuntimeMetadataError) => boolean) {
	await loadRuntimeMetadata(network, specVersion);
	return queryStore(runtimeMetadataRepository.errors, {network, specVersion, pallet}, filter).toArray();
}

export async function getRuntimeMetadataCall(network: string, specVersion: string, pallet: string, name: string) {
	await loadRuntimeMetadata(network, specVersion);
	return queryStore(runtimeMetadataRepository.calls, {network, specVersion, pallet, name}).first();
}

export async function getRuntimeMetadataEvent(network: string, specVersion: string, pallet: string, name: string) {
	await loadRuntimeMetadata(network, specVersion);
	return queryStore(runtimeMetadataRepository.events, {network, specVersion, pallet, name}).first();
}

export async function getRuntimeMetadataConstant(network: string, specVersion: string, pallet: string, name: string) {
	await loadRuntimeMetadata(network, specVersion);
	return queryStore(runtimeMetadataRepository.constants, {network, specVersion, pallet, name}).first();
}

export async function getRuntimeMetadataStorage(network: string, specVersion: string, pallet: string, name: string) {
	await loadRuntimeMetadata(network, specVersion);
	return queryStore(runtimeMetadataRepository.storages, {network, specVersion, pallet, name}).first();
}

export async function getRuntimeMetadataError(network: string, specVersion: string, pallet: string, name: string) {
	await loadRuntimeMetadata(network, specVersion);
	return queryStore(runtimeMetadataRepository.errors, {network, specVersion, pallet, name}).first();
}

export async function normalizePalletName(network: Network, name: string, specVersion: string) {
	console.log("normalize", network.name, specVersion, name);
	const pallets = await getRuntimeMetadataPallets(network.name, specVersion, it => it.name.toLowerCase() === name);
	console.log(pallets);

	// use found name from runtime metadata or try to fix the first letter casing as fallback
	return pallets[0]?.name || upperFirst(name);
}

export async function normalizeCallName(network: Network, name: string, specVersion: string) {
	console.log("normalize", name);
	let [palletName = "", callName = ""] = name.toLowerCase().split(".");

	palletName = await normalizePalletName(network, palletName, specVersion);
	console.log(palletName);

	const calls = await getRuntimeMetadataCalls(network.name, specVersion, palletName, it => it.name.toLowerCase() === callName);

	// use found name from runtime metadata or try to fix the first letter casing as fallback
	callName = calls[0]?.name || lowerFirst(callName);

	return `${palletName}.${callName}`;
}

export async function normalizeEventName(network: Network, name: string, specVersion: string) {
	let [palletName = "", eventName = ""] = name.toLowerCase().split(".");

	palletName = await normalizePalletName(network, palletName, specVersion);

	const events = await getRuntimeMetadataEvents(network.name, specVersion, palletName, it => it.name.toLowerCase() === eventName);

	// use found name from runtime metadata or try to fix the first letter casing as fallback
	eventName = events[0]?.name || upperFirst(eventName);

	return `${palletName}.${eventName}`;
}

export async function normalizeConstantName(network: Network, name: string, specVersion: string) {
	let [palletName = "", constantName = ""] = name.toLowerCase().split(".");

	palletName = await normalizePalletName(network, palletName, specVersion);

	const constants = await getRuntimeMetadataConstants(network.name, specVersion, palletName, it => it.name.toLowerCase() === constantName);

	// use found name from runtime metadata or try to fix the first letter casing as fallback
	constantName = constants[0]?.name || upperFirst(constantName);

	return `${palletName}.${constantName}`;
}

export async function normalizeStorageName(network: Network, name: string, specVersion: string) {
	let [palletName = "", storageName = ""] = name.toLowerCase().split(".");

	palletName = await normalizePalletName(network, palletName, specVersion);

	const storages = await getRuntimeMetadataStorages(network.name, specVersion, palletName, it => it.name.toLowerCase() === storageName);

	// use found name from runtime metadata or try to fix the first letter casing as fallback
	storageName = storages[0]?.name || upperFirst(storageName);

	return `${palletName}.${storageName}`;
}

export async function normalizeErrorName(network: Network, name: string, specVersion: string) {
	let [palletName = "", errorName = ""] = name.toLowerCase().split(".");

	palletName = await normalizePalletName(network, palletName, specVersion);

	const errors = await getRuntimeMetadataErrors(network.name, specVersion, palletName, it => it.name.toLowerCase() === errorName);

	// use found name from runtime metadata or try to fix the first letter casing as fallback
	errorName = errors[0]?.name || upperFirst(errorName);

	return `${palletName}.${errorName}`;
}

/*** PRIVATE ***/

async function loadRuntimeMetadata(network: string, specVersion: string) {
	await self.navigator.locks.request(`runtime-metadata/${network}/${specVersion}`, async () => {
		const spec = await runtimeMetadataRepository.specs.get([network, specVersion]);

		if (spec) {
			console.log("metadata already downloaded", network, specVersion);
			return;
		}

		console.log("downloading metadata", network, specVersion);

		const worker = new RuntimeSpecWorker();
		await worker.loadMetadata(network, specVersion as string);

		worker.terminate();
	});
}

function queryStore<T>(table: Table<T>, where: Record<string, any>, filter?: (it: T) => boolean) {
	let collection = table.where(where);

	if (filter) {
		collection = collection.filter(filter);
	}

	return collection;
}
