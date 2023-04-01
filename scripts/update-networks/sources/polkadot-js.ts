import { ApiPromise, WsProvider } from "@polkadot/api";
import { prodChains, prodParasKusama, prodParasKusamaCommon, prodParasPolkadot, prodParasPolkadotCommon, prodRelayKusama, prodRelayPolkadot, testChains, testParasRococo, testParasRococoCommon, testParasWestend, testParasWestendCommon, testRelayRococo, testRelayWestend } from "@polkadot/apps-config/endpoints";
import { EndpointOption } from "@polkadot/apps-config/endpoints/types";
import { Text } from "@polkadot/types";
import { ChainProperties } from "@polkadot/types/interfaces";
import { chainColors, nodeColors, polkadotJsNetworkNames, polkadotJsNetworkParachainIds, polkadotJsNetworkRelayChains, specColors } from "../config/polkadot-js";

import { Network, SourceData, SourceType } from "../model";
import { log } from "../utils/log";
import { sanitize } from "../utils/sanitize";
import { checkSourceData } from "../utils/source-data";
import { getArchiveRegistryData } from "./archive-registry";

const configs: Record<string, EndpointOption[]> = {
	polkadot: [
		...prodParasPolkadot,
		...prodParasPolkadotCommon,
		prodRelayPolkadot,
	],
	kusama: [
		...prodParasKusama,
		...prodParasKusamaCommon,
		prodRelayKusama,
	],
	rococo: [
		...testParasRococo,
		...testParasRococoCommon,
		testRelayRococo,
	],
	wested: [
		...testParasWestend,
		...testParasWestendCommon,
		testRelayWestend,
	],
	other: [
		...prodChains,
		...testChains,
	]
};

export async function getPolkadotJsData(network: Network): Promise<SourceData> {
	const sourceData: SourceData = {
		type: SourceType.POLKADOT_JS
	};

	const config = getEndpointConfig(network);

	if (!config) {
		log(log.warn, `${SourceType.POLKADOT_JS} source: No endpoint config found`);
		return sourceData;
	}

	let properties: ChainProperties|undefined;
	let text: Text|undefined;
	let name: Text|undefined;
	let lastError;

	for (const provider of Object.values(config.providers)) {
		let api;
		try {
			const wsProvider = new WsProvider(provider, 0);
			await wsProvider.connect();

			api = new ApiPromise({ provider: wsProvider });
			await api.isReadyOrError;

			//properties = api.registry.getChainProperties();
			properties = await api.rpc.system.properties();
			text = await api.rpc.system.chain();
			name = await api.rpc.system.name();
		} catch(e: any) {
			lastError = e;
			//log(e);
			// pass
		} finally {
			try {
				await api?.disconnect();
			} catch(e: any) {
				//error(colors.red(e));
				// pass
			}
		}

		if (properties) {
			break;
		}
	}

	if (!properties) {
		log(log.warn, `${SourceType.POLKADOT_JS} source: Cannot fetch RPC data`);
		//log(lastError);
		return sourceData;
	}

	const chainText = sanitize(text?.toString() || "");
	const chainName = sanitize(name?.toString() || "");

	sourceData.parachainId = config.paraId;
	sourceData.prefix = properties.ss58Format.unwrapOr(undefined)?.toNumber();
	sourceData.decimals = (properties.tokenDecimals.unwrapOr(undefined)?.toPrimitive() as number[])?.[0];
	sourceData.symbol = (properties.tokenSymbol.unwrapOr(undefined)?.toPrimitive() as string[])?.[0];

	const color = chainColors[chainText] || nodeColors[chainName] || specColors[chainName];
	sourceData.color = color?.toLowerCase();

	checkSourceData(sourceData, ["parachainId", "prefix", "decimals", "symbol", "color"]);

	return sourceData;
}

function getEndpointConfig(network: Network) {
	const archiveRegistryData = getArchiveRegistryData(network, false);

	const polkadotJsNetworkName = polkadotJsNetworkNames[network.name] || network.name;
	const polkadotJsNetworkParachainId = polkadotJsNetworkParachainIds[network.name] || archiveRegistryData.parachainId;
	const polkadotJsNetworkRelayChain = polkadotJsNetworkRelayChains[network.name] || archiveRegistryData.relayChain || "other";

	const config = configs[polkadotJsNetworkRelayChain]
		?.find(it =>
			(it.paraId && it.paraId === polkadotJsNetworkParachainId)
			|| (it.info && it.info === polkadotJsNetworkName)
		);

	return config;
}
