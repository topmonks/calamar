import networksJson from "@subsquid/archive-registry/networks.json";

import { Network, SourceData, SourceType } from "../model";
import { checkSourceData } from "../utils/source-data";

export function getArchiveRegistryData(network: Network): SourceData {
	const data: SourceData = {
		type: SourceType.ARCHIVE_REGISTRY,
		symbol: networksJson.networks.find(it => it.name === network.name)?.tokens?.[0]
	};

	checkSourceData(data, ["symbol"]);

	return data;
}
