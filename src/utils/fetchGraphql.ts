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

	try {
		const jsonResult = await response.json();
		console.log(response.status);
		console.log("FRET", jsonResult);
		return jsonResult.data;
	} catch(e) {
		console.log(e);
		return e;
	}
}
