import { fetchGraphql } from "../utils/fetchGraphql";
import { getArchive, getBalancesSquid, getExplorerSquid, getStatsSquid, getMainSquid } from "./networksService";

export async function fetchArchive<T = any>(network: string, query: string, variables: object = {}) {
	const archive = getArchive(network);

	if (!archive) {
		throw new Error(`Archive for network '${network}' not found`);
	}

	const provider = archive.providers[0];
	if (!provider) {
		throw new Error(`Archive for network '${network}' has no providers`);
	}

	return fetchGraphql<T>(provider.explorerUrl, query, variables);
}

export function fetchExplorerSquid<T = any>(network: string, query: string, variables: object = {}) {
	const squid = getExplorerSquid(network);

	if (!squid) {
		throw new Error(`Explorer squid for network '${network}' not found`);
	}

	return fetchGraphql<T>(squid.explorerUrl, query, variables);
}

export function fetchBalancesSquid<T = any>(network: string, query: string, variables: object = {}) {
	const squid = getBalancesSquid(network);

	if (!squid) {
		throw new Error(`Balances squid for network '${network}' not found`);
	}

	return fetchGraphql<T>(squid.explorerUrl, query, variables);
}

export function fetchMainSquid<T = any>(network: string, query: string, variables: object = {}) {
	const squid = getMainSquid(network);

	if (!squid) {
		throw new Error(`Main squid for network '${network}' not found`);
	}

	return fetchGraphql<T>(squid.explorerUrl, query, variables);
}

export function fetchStatsSquid<T = any>(network: string, query: string, variables: object = {}) {
	const squid = getStatsSquid(network);

	if (!squid) {
		throw new Error(`Stats squid for network '${network}' not found`);
	}

	return fetchGraphql<T>(squid.explorerUrl, query, variables);
}
