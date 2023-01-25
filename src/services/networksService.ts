import { ArchiveEntry, Network } from "@subsquid/archive-registry";
import archivesJson from "@subsquid/archive-registry/archives.json";
import networksJson from "@subsquid/archive-registry/networks.json";

import squidsJson from "../squids.json";

import { SquidEntry } from "../model/squid";

const networks = networksJson.networks.map(network => ({
	...network,
	displayName: network.displayName.replace(/ relay chain/i, "")
})) as Network[];

export function getArchives() {
	return archivesJson.archives as ArchiveEntry[];
}

export function getArchive(network: string) {
	return getArchives().find((archive) => archive.network === network);
}

export function getBalancesSquids() {
	return squidsJson.balances as SquidEntry[];
}

export function getBalancesSquid(network: string) {
	return getBalancesSquids().find((squid) => squid.network === network);
}

export function getCallerSquids() {
	return squidsJson.caller as SquidEntry[];
}

export function getCallerSquid(network: string) {
	return getCallerSquids().find((squid) => squid.network === network);
}

export function getExplorerSquids() {
	return squidsJson.explorer as SquidEntry[];
}

export function getExplorerSquid(network: string) {
	return getExplorerSquids().find((squid) => squid.network === network);
}

export function getChainStatsSquids() {
	return squidsJson.chainStats as SquidEntry[];
}

export function getChainStatsSquid(network: string) {
	return getChainStatsSquids().find((squid) => squid.network === network);
}

export function getNetworks() {
	return networks;
}

export function getNetwork(name: string) {
	return getNetworks().find((network) => network.name === name);
}
