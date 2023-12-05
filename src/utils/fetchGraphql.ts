import { DataError, FetchError } from "./error";

export async function fetchGraphql<T = any>(
	url: string,
	query: string,
	variables: object = {},
	fragments: Record<string, string> = {}
): Promise<T> {
	const usedFragments: Record<string, string> = {};

	const queue = [query];
	while (queue.length > 0) {
		const gql = queue.pop()!;

		const fragmentNames = gql
			.match(/\.\.\.[^,\s]+/g)
			?.map(it => it.slice(3))
			.filter(it => !usedFragments[it]);

		for (const fragmentName of fragmentNames || []) {
			const fragment = fragments[fragmentName] || "";
			usedFragments[fragmentName] = fragment;
			queue.push(fragment);
		}
	}

	const response = await fetch(url, {
		method: "POST",

		headers: {
			"Content-Type": "application/json",
		},

		body: JSON.stringify({
			query: `${query}\n${Object.values(usedFragments).join("\n")}`,
			variables,
		}),
	});

	const statusCode = response.status;

	if (statusCode !== 200) {
		throw new FetchError(url, statusCode);
	}

	const jsonResult = await response.json();

	if (jsonResult.errors && !jsonResult.data) {
		const error = jsonResult.errors[0];
		throw new DataError(error.message);
	}

	return jsonResult.data;
}
