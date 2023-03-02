import * as ss58 from "@subsquid/ss58";

import { ss58RegistryNetworkNames } from "../config";
import { Network, SourceData, SourceType } from "../model";
import { log } from "../utils/log";
import { checkSourceData } from "../utils/source-data";

export function getSS58RegistryData(network: Network): SourceData {
	const data: SourceData = {
		type: SourceType.SS58_REGISTRY,
	};

	const ss58NetworkName = ss58RegistryNetworkNames[network.name] || network.name;
	const registryEntry = ss58.registry.find(ss58NetworkName);

	if (!registryEntry) {
		log(log.warn, `${SourceType.SS58_REGISTRY} source: No registry entry found`);
		return data;
	}

	data.prefix = registryEntry?.prefix;
	data.decimals = registryEntry?.decimals[0];
	data.symbol = registryEntry?.symbols[0];

	checkSourceData(data);

	return data;
}
