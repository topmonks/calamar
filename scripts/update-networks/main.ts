import fs from "fs";
import path from "path";
import networksJson from "@subsquid/archive-registry/networks.json";
import archivesJson from "@subsquid/archive-registry/archives.json";

import { upperFirst } from "../../src/utils/string";

import { archiveRegistryArchiveNetworkNames, forceSource } from "./config";

import { Network, SourceData, SourceType } from "./model";

import { getSS58RegistryData } from "./sources/ss58-registry";
import { getArchiveRegistryData } from "./sources/archive-registry";
import { getRPCData } from "./sources/rpc";
import { getRuntimeSpecData } from "./sources/runtime-spec";

import { log } from "./utils/log";
import { checkNetwork, resolveIcon, resolveProperty, resolveSquids } from "./utils/network";

async function main() {
	const networks: Network[] = networksJson.networks.map(it => ({
		name: it.name,
		displayName: it.displayName.replace(/ relay chain/i, ""),
		icon: undefined,
		prefix: undefined,
		decimals: undefined,
		symbol: undefined,
		squids: {}
	}));

	for (const archive of archivesJson.archives) {
		if (!networks.find(it => (archiveRegistryArchiveNetworkNames[it.name] || it.name) === archive.network)) {
			const network: Network = {
				name: archive.network,
				displayName: upperFirst(archive.network),
				icon: undefined,
				prefix: undefined,
				decimals: undefined,
				symbol: undefined,
				squids: {}
			};

			log(log.warn, `Creating network '${network.name}' from archive`);

			networks.push(network);
		}
	}

	networks.sort((a, b) => a.name.localeCompare(b.name));

	for (const network of networks) {
		log.flush("\n---------------------------\n");

		log(`[${network.name}]`);
		log.flush();

		const sources: SourceData[] = [];

		sources.push(getSS58RegistryData(network));
		sources.push(getArchiveRegistryData(network));
		sources.push(await getRPCData(network));
		sources.push(await getRuntimeSpecData(network));

		resolveIcon(network);

		resolveProperty(
			network,
			"prefix",
			sources,
			[
				SourceType.SS58_REGISTRY,
				SourceType.RPC,
				SourceType.RUNTIME_SPEC
			],
			forceSource[network.name]?.prefix
		);

		resolveProperty(
			network,
			"decimals",
			sources,
			[
				SourceType.SS58_REGISTRY,
				SourceType.RPC,
			],
			forceSource[network.name]?.decimals
		);

		resolveProperty(
			network,
			"symbol",
			sources,
			[
				SourceType.SS58_REGISTRY,
				SourceType.RPC,
				SourceType.ARCHIVE_REGISTRY
			],
			forceSource[network.name]?.symbol
		);

		await resolveSquids(network);

		checkNetwork(network);
	}

	log.flush("\n---------------------------\n");

	const validNetworks = networks.filter(it => !it.hasErrors);
	const invalidNetworks = networks.filter(it => it.hasErrors);

	if (validNetworks.length > 0) {
		log.flush();
		log(`Valid networks (${validNetworks.length}):\n`);
		validNetworks.forEach(it => log(`- ${it.name}`, log.ok));
	}

	if (invalidNetworks.length > 0) {
		log.flush();
		log(`Invalid networks (${invalidNetworks.length}):\n`);
		invalidNetworks.forEach(it => log(`- ${it.name}`, log.error, ":", it.hasErrors!.join(", ")));
	}

	const networksFile = path.join(__dirname, "..", "..", "src", "networks.json");
	fs.writeFileSync(networksFile, JSON.stringify(networks.filter(it => !it.hasErrors), null, 4));

	log.flush();
	log(log.ok, `Writing valid networks into ${networksFile} file`);

	process.exit(0); // sometimes it hangs probably because unsuccesful disconnect from RPC
}

main();
