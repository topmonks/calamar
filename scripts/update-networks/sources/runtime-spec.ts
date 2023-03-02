import { Metadata, TypeRegistry } from "@polkadot/types";

import { getRuntimeSpec } from "../../../src/services/runtimeService";

import { Network, SourceData, SourceType } from "../model";
import { log } from "../utils/log";
import { checkSourceData } from "../utils/source-data";

export async function getRuntimeSpecData(network: Network): Promise<SourceData> {
	const sourceData: SourceData = {
		type: SourceType.RUNTIME_SPEC
	};

	try {
		const runtimeSpec = await getRuntimeSpec(network.name, "latest");

		const registry = new TypeRegistry();
		const metadata = new Metadata(registry, runtimeSpec.hex);
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
