import { ArchiveEntry, Network } from "@subsquid/archive-registry";
import archivesJson from "@subsquid/archive-registry/archives.json";
import networksJson from "@subsquid/archive-registry/networks.json";

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

export function getNetworks() {
	return networks;
}

export function getNetwork(name: string) {
	return getNetworks().find((network) => network.name === name);
}
