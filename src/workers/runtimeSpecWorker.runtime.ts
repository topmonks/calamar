import { fetchArchive } from "../services/fetchService";
import { decodeMetadata } from "../utils/decodeMetadata2";
import { WebWorkerRuntime } from "../utils/webWorker";
import { RuntimeSpecWorkerData } from "./runtimeSpecWorker";

new WebWorkerRuntime(
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
);
