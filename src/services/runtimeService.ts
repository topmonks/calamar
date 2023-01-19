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

export async function getRuntimeSpec(network: string, specVersion: "latest"): Promise<RuntimeSpec>;
export async function getRuntimeSpec(network: string, specVersion: number|"latest"): Promise<RuntimeSpec|undefined>;
export async function getRuntimeSpec(network: string, specVersion: number|"latest"): Promise<RuntimeSpec|undefined> {
	if (specVersion === "latest") {
		const response = await fetchGraphql<{spec: Omit<RuntimeSpec, "metadata">[]}>(
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

		const spec = response.spec[0]!;

		return {
			...spec,
			metadata: decodeMetadata(spec.hex)
		};
	}

	const specs = await getRuntimeSpecs(network, [specVersion]);
	return specs[specVersion];
}

export async function getRuntimeSpecs(
	network: string,
	specVersions: number[] | undefined
) {
	if (specVersions == undefined || specVersions.length === 0) {
		specVersions = [];
	}

	const specs: Record<number, RuntimeSpec> = {};

	const response = await fetchGraphql<{specs: Omit<RuntimeSpec, "metadata">[]}>(
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


	for (const spec of response.specs) {
		specs[spec.specVersion] = {
			...spec,
			metadata: decodeMetadata(spec.hex)
		};
	}

	return specs;
}
