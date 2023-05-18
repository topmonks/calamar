import { fetchGraphql } from "../utils/fetchGraphql";
import { getArchive, getBalancesSquid, getExplorerSquid, getStatsSquid, getMainSquid, getMainIdentitesSquid } from "./networksService";

export async function fetchArchive<T = any>(network: string, query: string, variables: object = {}) {
	const archiveUrl = getArchive(network);

	if (!archiveUrl) {
		throw new Error(`Archive for network '${network}' not found`);
	}

	return fetchGraphql<T>(archiveUrl, query, variables);
}

export function fetchExplorerSquid<T = any>(network: string, query: string, variables: object = {}) {
	const squidUrl = getExplorerSquid(network);

	if (!squidUrl) {
		throw new Error(`Explorer squid for network '${network}' not found`);
	}

	return fetchGraphql<T>(squidUrl, query, variables);
}

export function fetchBalancesSquid<T = any>(network: string, query: string, variables: object = {}) {
	const squidUrl = getBalancesSquid(network);

	if (!squidUrl) {
		throw new Error(`Balances squid for network '${network}' not found`);
	}

	return fetchGraphql<T>(squidUrl, query, variables);
}

export function fetchMainSquid<T = any>(network: string, query: string, variables: object = {}) {
	const squidUrl = getMainSquid(network);

	if (!squidUrl) {
		throw new Error(`Main squid for network '${network}' not found`);
	}

	return fetchGraphql<T>(squidUrl, query, variables);
}

export function fetchMainIdentitiesSquid<T = any>(network: string, query: string, variables: object = {}) {
	const squidUrl = getMainIdentitesSquid(network);

	if (!squidUrl) {
		throw new Error(`Main (identities) squid for network '${network}' not found`);
	}

	return fetchGraphql<T>(squidUrl, query, variables);
}

export function fetchStatsSquid<T = any>(network: string, query: string, variables: object = {}) {
	const squidUrl = getStatsSquid(network);

	if (!squidUrl) {
		throw new Error(`Stats squid for network '${network}' not found`);
	}

	return fetchGraphql<T>(squidUrl, query, variables);
}
