import { DecodedMetadata } from "../model/decodedMetadata";
import { fetchArchive } from "../services/fetchService";
import { decodeMetadata } from "../utils/decodeMetadata2";
import { WebWorkerRuntime } from "../utils/webWorker";
import { RuntimeSpecWorkerData } from "./runtimeSpecWorker";

/**
 * The reason to obtaining runtime metadata in a web worker is
 * because metadata decoding is memory and CPU-intensive operation
 * and would block the main UI thread.
 */
new WebWorkerRuntime(
	async (e: MessageEvent<RuntimeSpecWorkerData>) => {
		let metadata: DecodedMetadata|undefined = undefined;

		const {network, specVersion} = e.data;

		console.log("worker", network, specVersion);

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

		metadata = response.metadata[0] && decodeMetadata(response.metadata[0].hex);

		return metadata;
	}
);
