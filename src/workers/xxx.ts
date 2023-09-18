import { DecodedMetadata } from "../model/decodedMetadata";
import { fetchArchive } from "../services/fetchService";
import { decodeMetadata } from "../utils/decodeMetadata2";
import { WebWorker } from "../utils/webWorker";

export interface RuntimeSpecWorkerData {
	network: string;
	specVersion: number;
}

/*export const runtimeSpecWorker = new WebWorker<RuntimeSpecWorkerData, DecodedMetadata|undefined>(
	() => new Worker("./runtimeSpecWorker.ts"),
	async (e: MessageEvent<RuntimeSpecWorkerData>) => {
		const {network, specVersion} = e.data;

		const response = await fetchArchive<{metadata: {hex: `0x${string}`}[]}>(
			network, `
				query ($specVersion: Int!) {
					metadata(where: {specVersion_eq: $specVersion}, orderBy: specVersion_DESC) {
						hex
					}
				}
			`,
			{
				specVersion
			}
		);

		const metadata = response.metadata[0] && decodeMetadata(response.metadata[0].hex);

		return metadata;
	}
);*/

self.onmessage = async (e: MessageEvent) => {
	self.postMessage(JSON.stringify(undefined));
};
