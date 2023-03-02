import { Network } from "../model/network";

import networks from "../networks.json";

export function getArchive(network: string) {
	return getNetwork(network)?.squids["archive"];
}

export function getBalancesSquid(network: string) {
	return getNetwork(network)?.squids["balances"];
}

export function getExplorerSquid(network: string) {
	return getNetwork(network)?.squids["explorer"];
}

export function getMainSquid(network: string) {
	return getNetwork(network)?.squids["main"];
}

export function getStatsSquid(network: string) {
	return getNetwork(network)?.squids["stats"];
}

export function getNetworks() {
	return networks as Network[];
}

export function getNetwork(name: string) {
	return getNetworks().find((network) => network.name === name);
}

export function hasSupport(network: string, feature: "archive"|"balances-squid"|"explorer-squid"|"main-squid"|"stats-squid") {
	switch(feature) {
		case "archive": return !!getArchive(network);
		case "balances-squid": return !!getBalancesSquid(network);
		case "explorer-squid": return !!getExplorerSquid(network);
		case "main-squid": return !!getMainSquid(network);
		case "stats-squid": return !!getStatsSquid(network);
	}
}
