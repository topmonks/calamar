import { Metadata, PortableRegistry, TypeRegistry, Vec } from "@polkadot/types";
import { Si1Field } from "@polkadot/types/interfaces";
import { getSiName } from "@polkadot/types/metadata/util";
import { hexToU8a } from "@polkadot/util";

import { RuntimeMetadataArg } from "../model/runtime-metadata/runtimeMetadataArg";
import { RuntimeMetadataPallet } from "../model/runtime-metadata/runtimeMetadataPallet";
import { runtimeMetadataRepository } from "../repositories/runtimeMetadataRepository";
import { fetchArchive } from "../services/fetchService";
import { WebWorkerRuntime } from "../utils/webWorker";

import { RuntimeSpecWorkerMethods } from "./runtimeSpecWorker";

/**
 * The reason to obtaining runtime metadata in a web worker is
 * because metadata decoding is memory and CPU-intensive operation
 * and would block the main UI thread.
 */
class RuntimeSpecWorkerRuntime extends WebWorkerRuntime implements RuntimeSpecWorkerMethods {
	async loadMetadata(network: string, specVersion: string) {
		console.log("worker", network, specVersion);

		const response = await fetchArchive<{metadata: {hex: `0x${string}`}[]}>(
			network, `
				query ($specVersion: Int!) {
					metadata(where: {specVersion_eq: $specVersion}, orderBy: specVersion_DESC) {
						hex
					}
				}
			`,
			{
				specVersion: parseInt(specVersion)
			}
		);

		console.log("hex downloaded", network, specVersion);

		response.metadata[0] && await this.decodeAndSaveRuntimeMetadata(network, specVersion, response.metadata[0].hex);
	}

	/**
	 * Inspired by https://github.com/polkadot-js/api/blob/c73c26d13324a6211a7cf4e401aa032c87f7aa10/packages/typegen/src/metadataMd.ts
	 * which is a source code for https://polkadot.js.org/docs/polkadot
	 */
	protected async decodeAndSaveRuntimeMetadata(network: string, specVersion: string, metadataHex: `0x${string}`) {
		const registry = new TypeRegistry();
		const metadata = new Metadata(registry, metadataHex);

		registry.setMetadata(metadata);

		const latestMetadata = metadata.asLatest;

		const repository = runtimeMetadataRepository;

		await repository.transaction("rw", [
			repository.specs,
			repository.pallets,
			repository.calls,
			repository.events,
			repository.constants,
			repository.storages,
			repository.errors
		], async () => {
			await repository.specs.put({
				network,
				specVersion
			});

			for (const pallet of latestMetadata.pallets) {
				const palletMetadata: RuntimeMetadataPallet = {
					network,
					specVersion,
					name: pallet.name.toString(),
					callsCount: 0,
					eventsCount: 0,
					constantsCount: 0
				};

				if (pallet.calls.isSome) {
					const calls = latestMetadata.lookup.getSiType(pallet.calls.unwrap().type).def.asVariant.variants;

					for (const call of calls) {
						await repository.calls.put({
							network,
							specVersion,
							pallet: pallet.name.toString(),
							name: call.name.toString(),
							args: this.decodeArgs(latestMetadata.lookup, call.fields),
							description: call.docs.map(it => it.toString() === "" ? "\n\n" : it).join("")
						});

						palletMetadata.callsCount++;
					}
				}

				if (pallet.events.isSome) {
					const events = latestMetadata.lookup.getSiType(pallet.events.unwrap().type).def.asVariant.variants;

					for (const event of events) {
						await repository.events.put({
							network,
							specVersion,
							pallet: pallet.name.toString(),
							name: event.name.toString(),
							args: this.decodeArgs(latestMetadata.lookup, event.fields),
							description: event.docs.map(it => it.toString() === "" ? "\n\n" : it).join("")
						});

						palletMetadata.eventsCount++;
					}
				}

				for (const constant of pallet.constants) {
					await repository.constants.put({
						network,
						specVersion,
						pallet: pallet.name.toString(),
						name: constant.name.toString(),
						type: getSiName(latestMetadata.lookup, constant.type),
						value: registry.createTypeUnsafe<any>(registry.createLookupType(constant.type), [hexToU8a(constant.value.toHex())]).toJSON(),
						description: constant.docs.map(it => it.toString() === "" ? "\n\n" : it).join("")
					});

					palletMetadata.constantsCount++;
				}

				if (pallet.storage.isSome) {
					const storages = pallet.storage.unwrap().items;

					for (const storage of storages) {
						let args: string[]|undefined = undefined;

						if (storage.type.isMap) {
							const { hashers, key } = storage.type.asMap;

							args = hashers.length === 1
								? [getSiName(latestMetadata.lookup, key)]
								: latestMetadata.lookup.getSiType(key).def.asTuple.map((it) =>
									getSiName(latestMetadata.lookup, it)
								);
						}

						let returnType = getSiName(
							latestMetadata.lookup,
							storage.type.isPlain
								? storage.type.asPlain
								: storage.type.asMap.value
						);

						if (storage.modifier.isOptional) {
							returnType = `Option<${returnType}>`;
						}

						await repository.storages.put({
							network,
							specVersion,
							pallet: pallet.name.toString(),
							name: storage.name.toString(),
							args,
							returnType,
							description: storage.docs.map(it => it.toString() === "" ? "\n\n" : it).join("")
						});
					}
				}

				if (pallet.errors.isSome) {
					const errors = latestMetadata.lookup.getSiType(pallet.errors.unwrap().type).def.asVariant.variants;

					for (const error of errors) {
						await repository.errors.put({
							network,
							specVersion,
							pallet: pallet.name.toString(),
							name: error.name.toString(),
							description: error.docs.map(it => it.toString() === "" ? "\n\n" : it).join("")
						});
					}
				}

				await repository.pallets.put(palletMetadata);
			}
		});
	}

	protected decodeArgs(lookup: PortableRegistry, fields: Vec<Si1Field>): RuntimeMetadataArg[] {
		return fields.map((field, index) => ({
			name: field.name.unwrapOr(index).toString(),
			type: getSiName(lookup, field.type),
			typeName: field.typeName.isSome
				? field.typeName.unwrap().toString()
				: undefined
		}));
	}
}

new RuntimeSpecWorkerRuntime();
