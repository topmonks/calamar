import fs from "fs";
import path from "path";
import networksJson from "@subsquid/archive-registry/networks.json";
import archivesJson from "@subsquid/archive-registry/archives.json";
import CliTable3 from "cli-table3";
import colors from "colors";

import { upperFirst } from "../../src/utils/string";

import { archiveRegistryArchiveNetworkNames } from "./config/archive-registry";
import { forceSource } from "./config/prop-resolution";

import { Network, SourceData, SourceType } from "./model";

import { getSS58RegistryData } from "./sources/ss58-registry";
import { getArchiveRegistryData } from "./sources/archive-registry";
import { getCoinGeckoCoins } from "./sources/coingecko";
import { getPolkadotJsData } from "./sources/polkadot-js";
import { getRuntimeSpecData } from "./sources/runtime-spec";

import { log } from "./utils/log";
import { checkNetwork, resolveCoinGeckoCoin, resolveIcon, resolveProperty, resolveSquids } from "./utils/network";
import { squidTypes } from "./config/squids";
import { printCountsReport, printPropsReport, printSquidReport } from "./utils/report";

async function main() {
	const networks: Network[] = networksJson.networks.map(it => ({
		name: it.name,
		displayName: it.displayName.replace(/ relay chain/i, ""),
		icon: undefined,
		color: undefined,
		website: undefined,
		parachainId: undefined,
		relayChain: undefined,
		prefix: undefined,
		decimals: undefined,
		symbol: undefined,
		coinGeckoCoin: undefined,
		squids: {}
	}));

	networks.sort((a, b) => a.name.localeCompare(b.name));

	const coinGeckoCoins = await getCoinGeckoCoins();

	for (const network of networks) {
		log.flush("\n---------------------------\n");

		log(`[${network.name}]`);
		log.flush();

		const sources: SourceData[] = [];

		sources.push(getSS58RegistryData(network));
		sources.push(getArchiveRegistryData(network));
		sources.push(await getPolkadotJsData(network));
		sources.push(await getRuntimeSpecData(network));

		resolveProperty(
			network,
			"parachainId",
			sources,
			[
				SourceType.ARCHIVE_REGISTRY
			]
		);

		resolveProperty(
			network,
			"relayChain",
			sources,
			[
				SourceType.ARCHIVE_REGISTRY
			]
		);

		resolveProperty(
			network,
			"prefix",
			sources,
			[
				SourceType.SS58_REGISTRY,
				SourceType.POLKADOT_JS,
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
				SourceType.POLKADOT_JS,
			],
			forceSource[network.name]?.decimals
		);

		resolveProperty(
			network,
			"symbol",
			sources,
			[
				SourceType.SS58_REGISTRY,
				SourceType.POLKADOT_JS,
				SourceType.ARCHIVE_REGISTRY
			],
			forceSource[network.name]?.symbol
		);

		resolveIcon(network);

		resolveProperty(
			network,
			"color",
			sources,
			[
				SourceType.POLKADOT_JS
			]
		);

		resolveProperty(
			network,
			"website",
			sources,
			[
				SourceType.ARCHIVE_REGISTRY
			]
		);

		resolveCoinGeckoCoin(network, coinGeckoCoins);

		await resolveSquids(network);

		checkNetwork(network);
	}

	log.flush("\n---------------------------\n");

	printPropsReport(networks);
	printSquidReport(networks);
	printCountsReport(networks);

	const networksFile = path.join(__dirname, "..", "..", "src", "networks.json");
	const exportData = networks.filter(it => !it.hasErrors).map(it => ({
		...it,
		coinGeckoId: it.coinGeckoCoin?.id,
		coinGeckoCoin: undefined,
		hasWarnings: undefined
	}));
	fs.writeFileSync(networksFile, JSON.stringify(exportData, null, 4));

	log.flush();
	log(log.ok, `Writing valid networks into ${networksFile} file`);

	process.exit(0); // sometimes it hangs probably because unsuccesful disconnect from RPC
}

main();
