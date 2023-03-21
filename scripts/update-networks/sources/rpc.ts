import { ApiPromise, WsProvider } from "@polkadot/api";
import { prodChains, prodParasKusama, prodParasKusamaCommon, prodParasPolkadot, prodParasPolkadotCommon, prodRelayKusama, prodRelayPolkadot, testChains, testParasRococo, testParasRococoCommon, testParasWestend, testParasWestendCommon, testRelayRococo, testRelayWestend } from "@polkadot/apps-config/endpoints";
import { ChainProperties } from "@polkadot/types/interfaces";

import { rpcNewtorkNames } from "../config";
import { Network, SourceData, SourceType } from "../model";
import { log } from "../utils/log";
import { checkSourceData } from "../utils/source-data";

export async function getRPCData(network: Network): Promise<SourceData> {
	const sourceData: SourceData = {
		type: SourceType.RPC
	};

	const rpcNetworkName = rpcNewtorkNames[network.name] || network.name;

	const configs = [
		...prodChains,
		...prodParasKusama,
		...prodParasKusamaCommon,
		...prodParasPolkadot,
		...prodParasPolkadotCommon,
		...testChains,
		...testParasRococo,
		...testParasRococoCommon,
		...testParasWestend,
		...testParasWestendCommon,
		prodRelayKusama,
		prodRelayPolkadot,
		testRelayRococo,
		testRelayWestend,
	].filter(it => it.info === rpcNetworkName);

	if (configs.length === 0) {
		log(log.warn, `${SourceType.RPC} source: No endpoints config found`);
		return sourceData;
	}

	const providers = configs.flatMap(config => Object.values(config.providers || {}));
	if (providers.length === 0) {
		log(log.warn, `${SourceType.RPC} source: No providers present`);
		return sourceData;
	}


	let properties: ChainProperties|undefined;
	let lastError;

	for (const provider of providers) {
		let api;
		try {
			const wsProvider = new WsProvider(provider, 0);
			await wsProvider.connect();

			api = new ApiPromise({ provider: wsProvider });
			await api.isReadyOrError;

			//properties = api.registry.getChainProperties();
			properties = await api.rpc.system.properties();
		} catch(e: any) {
			lastError = e;
			//error(colors.red(e));
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
		log(log.warn, `${SourceType.RPC} source: Cannot fetch data`);
		//log(lastError);
		return sourceData;
	}

	sourceData.prefix = properties.ss58Format.unwrapOr(undefined)?.toNumber();
	sourceData.decimals = (properties.tokenDecimals.unwrapOr(undefined)?.toPrimitive() as number[])?.[0];
	sourceData.symbol = (properties.tokenSymbol.unwrapOr(undefined)?.toPrimitive() as string[])?.[0];

	checkSourceData(sourceData);

	return sourceData;
}
