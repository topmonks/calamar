import { ArchiveEntry, Network } from "@subsquid/archive-registry";
import archivesJson from "@subsquid/archive-registry/archives.json";
import networksJson from "@subsquid/archive-registry/networks.json";

export function getArchives() {
	return archivesJson.archives as ArchiveEntry[];
}

export function getArchive(network: string) {
	return getArchives().find((archive) => archive.network === network);
}

export function getNetworks() {
	return networksJson.networks as Network[];
}

export function getNetwork(name: string) {
	return getNetworks().find((network) => network.name === name);
}
