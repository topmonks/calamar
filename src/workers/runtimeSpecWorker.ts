import { DecodedMetadata } from "../model/decodedMetadata";
import { WebWorker } from "../utils/webWorker";

export interface RuntimeSpecWorkerMethods {
	loadMetadata(network: string, specVersion: number): Promise<void>;
}

export class RuntimeSpecWorker extends WebWorker<RuntimeSpecWorkerMethods> {
	constructor() {
		super(new Worker(new URL("./runtimeSpecWorker.runtime.ts", import.meta.url)));
	}

	loadMetadata(network: string, specVersion: number) {
		return this.run("loadMetadata", network, specVersion);
	}
}
