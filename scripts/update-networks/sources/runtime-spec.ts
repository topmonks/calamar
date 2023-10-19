import { Metadata, TypeRegistry } from "@polkadot/types";

import { getLatestRuntimeSpecVersion } from "../../../src/services/runtimeSpecService";
import { fetchArchive } from "../../../src/services/fetchService";

import { Network, SourceData, SourceType } from "../model";
import { log } from "../utils/log";
import { checkSourceData } from "../utils/source-data";

export async function getRuntimeSpecData(network: Network): Promise<SourceData> {
	const sourceData: SourceData = {
		type: SourceType.RUNTIME_SPEC
	};

	try {
		const latestRuntimeSpecVersion = await getLatestRuntimeSpecVersion(network.name);

		const response = await fetchArchive<{metadata: {hex: `0x${string}`}[]}>(
			network.name, `
				query ($specVersion: Int!) {
					metadata(where: {specVersion_eq: $specVersion}, orderBy: specVersion_DESC) {
						hex
					}
				}
			`,
			{
				specVersion: latestRuntimeSpecVersion
			}
		);

		const metadataHex = response.metadata[0]?.hex;

		if (!metadataHex) {
			throw new Error("Not found");
		}

		const registry = new TypeRegistry();
		const metadata = new Metadata(registry, metadataHex);
		registry.setMetadata(metadata);

		const latestMetadata = metadata.asLatest;
		const prefix = latestMetadata.registry.getChainProperties()?.ss58Format.unwrap().toNumber();

		sourceData.prefix = prefix;

		checkSourceData(sourceData, ["prefix"]);
	} catch (e) {
		log(log.warn, `${SourceType.RUNTIME_SPEC} source: Cannot fetch runtime spec`);
		//log(e);
	}

	return sourceData;
}
