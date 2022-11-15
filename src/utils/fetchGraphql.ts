import { CustomError } from "ts-custom-error";

import { getArchive } from "../services/archiveRegistryService";

export class GraphQLError extends CustomError {
	constructor(error: any) {
		super(error.message);
	}
}

export async function fetchGraphql<T = any>(
	network: string,
	query: string,
	variables: object = {}
): Promise<T> {
	const archive = getArchive(network);

	if (!archive) {
		throw new Error(`Archive for network '${network} not found`);
	}

	const response = await fetch(archive.providers[0].explorerUrl, {
		method: "POST",

		headers: {
			"Content-Type": "application/json",
		},

		body: JSON.stringify({
			query,
			variables,
		}),
	});

	const jsonResult = await response.json();

	if (jsonResult.errors && !jsonResult.data) {
		const error = jsonResult.errors[0];
		throw new GraphQLError(error);
	}

	return jsonResult.data;
}
