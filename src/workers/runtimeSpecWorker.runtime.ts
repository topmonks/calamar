import { Metadata, PortableRegistry, TypeRegistry, Vec } from "@polkadot/types";
import { Si1Field } from "@polkadot/types/interfaces";
import { getSiName } from "@polkadot/types/metadata/util";

import { runtimeMetadataRepository } from "../repositories/runtimeMetadataRepository";
import { fetchArchive } from "../services/fetchService";
import { WebWorkerRuntime } from "../utils/webWorker";

import { RuntimeSpecWorkerMethods } from "./runtimeSpecWorker";
import { RuntimeMetadataArg } from "../model/runtime-metadata/runtimeMetadataArg";

/**
 * The reason to obtaining runtime metadata in a web worker is
 * because metadata decoding is memory and CPU-intensive operation
 * and would block the main UI thread.
 */
class RuntimeSpecWorkerRuntime extends WebWorkerRuntime implements RuntimeSpecWorkerMethods {
	async loadMetadata(network: string, specVersion: number) {
		await self.navigator.locks.request(`runtime-metadata/${network}/${specVersion}`, async () => {
			console.log("worker", network, specVersion);

			const spec = await runtimeMetadataRepository.specs.get([network, specVersion]);

			if (spec) {
				console.log("metadata already downloaded", network, specVersion);
				return;
			}

			console.log("downloading metadata", network, specVersion);

			const response = await fetchArchive<{metadata: {hex: `0x${string}`}[]}>(
				network, `
						query ($specVersion: Int!) {
							metadata(where: {specVersion_eq: $specVersion}, orderBy: specVersion_DESC) {
								hex
							}
						}
					`,
				{
					specVersion
				}
			);

			response.metadata[0] && await this.decodeAndSaveRuntimeMetadata(network, specVersion, response.metadata[0].hex);
		});
	}

	protected async decodeAndSaveRuntimeMetadata(network: string, specVersion: number, metadataHex: `0x${string}`) {
		const registry = new TypeRegistry();
		const metadata = new Metadata(registry, metadataHex);

		registry.setMetadata(metadata);

		const latestMetadata = metadata.asLatest;

		const repository = runtimeMetadataRepository;

		await repository.transaction("rw", [
			repository.specs,
			repository.pallets,
			repository.calls,
			repository.events
		], async () => {
			await repository.specs.put({
				network,
				specVersion
			});

			for (const pallet of latestMetadata.pallets) {
				await repository.pallets.put({
					network,
					specVersion,
					name: pallet.name.toString()
				});

				if (pallet.calls.isSome) {
					const calls = latestMetadata.lookup.getSiType(pallet.calls.unwrap().type).def.asVariant.variants;

					for (const call of calls) {
						await repository.calls.put({
							network,
							specVersion,
							pallet: pallet.name.toString(),
							name: call.name.toString(),
							args: this.decodeArgs(latestMetadata.lookup, call.fields)
						});
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
							args: this.decodeArgs(latestMetadata.lookup, event.fields)
						});
					}
				}
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
