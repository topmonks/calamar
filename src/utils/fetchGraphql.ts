import { CustomError } from "ts-custom-error";

export class GraphQLError extends CustomError {
	constructor(error: any) {
		super(error.message);
	}
}

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
		throw new GraphQLError(error);
	}

	return jsonResult.data;
}
