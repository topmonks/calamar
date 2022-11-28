import { RuntimeSpec } from "../model/runtimeSpec";
import { fetchGraphql } from "../utils/fetchGraphql";

export async function getRuntimeSpecVersions(network: string) {
	const response = await fetchGraphql<{metadata: {specVersion: number}[]}>(
		network, `
			query {
				metadata(orderBy: id_DESC) {
					specVersion
				}
			}
		`
	);

	return response.metadata.map(it => it.specVersion);
}

export async function getLatestRuntimeSpec(network: string) {
	const response = await fetchGraphql<{metadata: RuntimeSpec[]}>(
		network, `
			query {
				metadata(orderBy: id_DESC, limit: 1) {
					id
					blockHash
					blockHeight
					specName
					specVersion
					hex
				}
			}
		`
	);

	return response.metadata[0];
}

export async function getRuntimeSpec(
	network: string,
	specVersion: number
) {
	const response = await fetchGraphql<{metadata: RuntimeSpec[]}>(
		network, `
			query ($specVersion: Int!) {
				metadata(where: {specVersion_eq: $specVersion}) {
					id
					blockHash
					blockHeight
					specName
					specVersion
					hex
				}
			}
		`,
		{
			specVersion
		}
	);

	return response.metadata[0];
}
