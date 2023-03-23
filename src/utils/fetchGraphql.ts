import { DataError } from "./error";

export async function fetchGraphql<T = any>(
	url: string,
	query: string,
	variables: object = {}
): Promise<T> {
	const response = await fetch(url, {
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
		throw new DataError(error.message);
	}

	return jsonResult.data;
}
