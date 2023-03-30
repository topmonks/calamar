import networksJson from "@subsquid/archive-registry/networks.json";

import { Network, SourceData, SourceType } from "../model";
import { log } from "../utils/log";
import { checkSourceData } from "../utils/source-data";

export function getArchiveRegistryData(network: Network, check = true): SourceData {
	const data: SourceData = {
		type: SourceType.ARCHIVE_REGISTRY,
	};

	const registryNetwork = networksJson.networks.find(it => it.name === network.name);

	if (!registryNetwork) {
		log(log.warn, `${SourceType.ARCHIVE_REGISTRY} source: No registry network found`);
		return data;
	}

	data.website = registryNetwork.website;
	data.parachainId = registryNetwork.parachainId ? parseInt(registryNetwork.parachainId) : undefined;
	data.relayChain = registryNetwork.relayChain || undefined;
	data.symbol = registryNetwork.tokens?.[0];

	if (check) {
		checkSourceData(data, ["website", "parachainId", "relayChain", "symbol"]);
	}

	return data;
}
