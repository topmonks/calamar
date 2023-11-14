import { fetchGraphql } from "../utils/fetchGraphql";
import { getArchive, getExplorerSquid, getStatsSquid, getMainSquid, getIdentitesSquid } from "./networksService";

const graphqlFragments: Record<string, string> = {};

export async function fetchArchive<T = any>(network: string, query: string, variables: object = {}) {
	const archiveUrl = getArchive(network);

	if (!archiveUrl) {
		throw new Error(`Archive for network '${network}' not found`);
	}

	return fetchGraphql<T>(archiveUrl, query, variables, graphqlFragments);
}

export function fetchExplorerSquid<T = any>(network: string, query: string, variables: object = {}) {
	const squidUrl = getExplorerSquid(network);

	if (!squidUrl) {
		throw new Error(`Explorer squid for network '${network}' not found`);
	}

	return fetchGraphql<T>(squidUrl, query, variables, graphqlFragments);
}

export function fetchMainSquid<T = any>(network: string, query: string, variables: object = {}) {
	const squidUrl = getMainSquid(network);

	if (!squidUrl) {
		throw new Error(`Main squid for network '${network}' not found`);
	}

	return fetchGraphql<T>(squidUrl, query, variables, graphqlFragments);
}

export function fetchIdentitiesSquid<T = any>(network: string, query: string, variables: object = {}) {
	const squidUrl = getIdentitesSquid(network);

	if (!squidUrl) {
		throw new Error(`Identities squid for network '${network}' not found`);
	}

	return fetchGraphql<T>(squidUrl, query, variables, graphqlFragments);
}

export function fetchStatsSquid<T = any>(network: string, query: string, variables: object = {}) {
	const squidUrl = getStatsSquid(network);

	if (!squidUrl) {
		throw new Error(`Stats squid for network '${network}' not found`);
	}

	return fetchGraphql<T>(squidUrl, query, variables, graphqlFragments);
}

export function registerItemFragment(name: string, onType: string, body: string) {
	registerGraphqlFragment(name, onType, body);
}

export function registerItemsConnectionFragment(name: string, onType: string, body: string) {
	registerGraphqlFragment(name, onType, `
		edges {
			node {
				${body}
			}
		}
		pageInfo {
			endCursor
			hasNextPage
			hasPreviousPage
			startCursor
		}
	`);
}

export function registerGraphqlFragment(name: string, onType: string, body: string) {
	graphqlFragments[name] = `
		fragment ${name} on ${onType} {
			${body}
		}
	`;
}
