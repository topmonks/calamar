import { DecodedMetadata } from "../model/decodedMetadata";
//import { runtimeSpecWorker } from "../workers/runtimeSpecWorker";

import { fetchArchive } from "./fetchService";

const metadataCache: Record<string, DecodedMetadata> = {};

export async function getLatestRuntimeSpecVersion(network: string) {
	const response = await fetchArchive<{spec: {specVersion: number}[]}>(
		network, `
			query {
				spec: metadata(orderBy: specVersion_DESC, limit: 1) {
					specVersion
				}
			}
		`
	);

	const latestSpec = response.spec[0];

	if (!latestSpec) {
		throw new Error(`Cannot get latest spec for network '${network}'`);
	}

	return latestSpec.specVersion;
}

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

export async function getRuntimeMetadata(network: string, specVersion: number|undefined): Promise<DecodedMetadata|undefined> {
	if (!specVersion) {
		return undefined;
	}

	if (!metadataCache[specVersion]) {
		const worker = new Worker("./workers/xyz.ts");

		worker.postMessage(JSON.stringify({
			network,
			specVersion
		}));

		const metadata = await new Promise<DecodedMetadata>((resolve) => {
			worker.onmessage = (e: MessageEvent<any>) => {
				resolve(e.data);
			};
		});

		worker.terminate();

		/*const metadata = await runtimeSpecWorker.run({
			network,
			specVersion
		});*/

		if (metadata) {
			metadataCache[specVersion] = metadata;
		}
	}

	return metadataCache[specVersion];
}
