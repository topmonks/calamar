import { WebWorker } from "../utils/webWorker";

export interface RuntimeSpecWorkerMethods {
	loadMetadata(network: string, specVersion: string): Promise<void>;
}

export class RuntimeSpecWorker extends WebWorker<RuntimeSpecWorkerMethods> {
	constructor() {
		super(new Worker(new URL("./runtimeSpecWorker.runtime.ts", import.meta.url)));
	}

	loadMetadata(network: string, specVersion: string) {
		return this.run("loadMetadata", network, specVersion);
	}
}
