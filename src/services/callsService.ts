import { fetchGraphql } from "../utils/fetchGraphql";

export type CallsFilter = any;

export async function getCall(network: string, filter?: CallsFilter) {
	const calls = await getCalls(network, 1, 0, filter);
	return calls?.[0];
}

export async function getCalls(
	network: string,
	limit: number,
	offset: number,
	filter?: CallsFilter
) {
	const response = await fetchGraphql(
		network,
		`query ($limit: Int!, $offset: Int!, $filter: CallWhereInput) {
			calls(limit: $limit, offset: $offset, where: $filter) {
				id
				name
				success
				origin
				args
				block {
					timestamp
					id
					height
					spec {
						specVersion
					}
				}
				parent {
					id
					name
				}
				extrinsic {
					id
					version
				}
			}
		}`,
		{
			limit,
			offset,
			filter,
		}
	);

	return response?.calls;
}

export async function getCallsForExtrinsic(
	network: string,
	id: string
) {
	const response = await fetchGraphql(
		network,
		`query ($id: String!) {
			extrinsicById(id: $id) {
				call {
					block {
						timestamp
						id
						height
					}
					id
					name
					origin
					extrinsic {
						id
					}
					args
				}
			}
		}`,
		{
			id,
		}
	);

	return [response.extrinsicById.call];
}
