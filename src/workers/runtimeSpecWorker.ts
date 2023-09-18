import { DecodedMetadata } from "../model/decodedMetadata";
import { WebWorker } from "../utils/webWorker";

export interface RuntimeSpecWorkerData {
	network: string;
	specVersion: number;
}

export const runtimeSpecWorker = new WebWorker<RuntimeSpecWorkerData, DecodedMetadata|undefined>(
	() => new Worker(new URL("./runtimeSpecWorker.runtime.ts", import.meta.url))
);
