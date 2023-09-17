import { RuntimeSpec } from "../model/runtimeSpec";
import { decodeMetadata } from "../utils/decodeMetadata";
import { uniq } from "../utils/uniq";

import { fetchArchive } from "./fetchService";

export async function getRuntimeSpecVersions(network: string) {
	const response = await fetchArchive<{metadata: {specVersion: number}[]}>(
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
		return getLatestRuntimeSpec(network);
	}

	const specs = await getRuntimeSpecs(network, [specVersion]);
	return specs[specVersion];
}

export async function getLatestRuntimeSpec(network: string) {
	const response = await fetchArchive<{spec: Omit<RuntimeSpec, "metadata">[]}>(
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
		metadata: await decodeMetadata(spec.hex)
	};
}

export async function getRuntimeSpecs(
	network: string,
	specVersions: (number|"latest")[]| undefined
) {
	if (specVersions == undefined || specVersions.length === 0) {
		specVersions = [];
	}

	const specs: Record<number|string, RuntimeSpec> = {};

	if (specVersions.includes("latest")) {
		specs["latest"] = await getLatestRuntimeSpec(network);
		specVersions = specVersions.filter(it => it !== "latest");
	}

	const response = await fetchArchive<{specs: Omit<RuntimeSpec, "metadata">[]}>(
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
			specVersions: uniq(specVersions)
		}
	);

	for (const spec of response.specs) {
		specs[spec.specVersion] = {
			...spec,
			metadata: await decodeMetadata(spec.hex)
		};
	}

	return specs;
}
