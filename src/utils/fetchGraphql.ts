import { getArchive } from "../services/archiveRegistryService";

export async function fetchGraphql(
	network: string,
	query: string,
	variables: object = {}
) {
	const archive = getArchive(network);

	if (!archive) {
		throw new Error(`Archive for network '${network} not found`);
	}

	const results = await fetch(archive.providers[0].explorerUrl, {
		method: "POST",

		headers: {
			"Content-Type": "application/json",
		},

		body: JSON.stringify({
			query,
			variables,
		}),
	});

	const jsonResult = await results.json();
	return jsonResult.data;
}
