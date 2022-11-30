import { RuntimeSpec } from "../model/runtimeSpec";
import { decodeMetadata } from "../utils/decodeMetadata";
import { fetchGraphql } from "../utils/fetchGraphql";

export async function getRuntimeSpecVersions(network: string) {
	const response = await fetchGraphql<{metadata: {specVersion: number}[]}>(
		network, `
			query {
				metadata(orderBy: specVersion_DESC) {
					specVersion
				}
			}
		`
	);

	return response.metadata.map(it => it.specVersion);
}

export async function getLatestRuntimeSpec(network: string) {
	const response = await fetchGraphql<{spec: RuntimeSpec[]}>(
		network, `
			query {
				spec: metadata(orderBy: specVersion_DESC, limit: 1) {
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

	const spec = response.spec[0];
	spec.metadata = decodeMetadata(spec.hex);

	return spec;
}

export async function getRuntimeSpecs(
	network: string,
	specVersions: number[]
) {
	const response = await fetchGraphql<{specs: RuntimeSpec[]}>(
		network, `
			query ($specVersions: [Int!]!) {
				specs: metadata(where: {specVersion_in: $specVersions}, orderBy: specVersion_DESC) {
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
			specVersions
		}
	);

	return response.specs.map<RuntimeSpec>(spec => ({
		...spec,
		metadata: decodeMetadata(spec.hex)
	}));
}
