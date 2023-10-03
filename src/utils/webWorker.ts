type Parameters<T> = T extends (...args: infer P) => any ? P : never;
type ReturnType<T> = T extends (...args: any) => Promise<infer R> ? R : never;

/**
 * Web worker handler
 *
 * Used to run the web worker in a type-safe way
 */
export class WebWorker<T> {
	constructor(protected worker: Worker) {}

	async run<M extends keyof T>(method: M, ...args: Parameters<T[M]>): Promise<ReturnType<T[M]>> {
		this.worker.postMessage({method, args});

		const responseData = await new Promise<ReturnType<T[M]>>((resolve) => {
			this.worker.onmessage = (e: MessageEvent<ReturnType<T[M]>>) => {
				resolve(e.data);
			};
		});

		return responseData;
	}

	terminate() {
		this.worker.terminate();
	}
}

interface WebWorkerRuntimeData {
	method: string;
	args: any[];
}

/**
 * Web worker runtime
 *
 * Basically a type-safe wrapper around the web worker's runtime
 *
 * Must be separated from WebWorker class to prevent circular dependency between JS chunks
 */
export class WebWorkerRuntime {
	constructor() {
		self.onmessage = async (e: MessageEvent<WebWorkerRuntimeData>) => {
			const {method, args} = e.data;
			self.postMessage(await (this as any)[method](...args));
		};
	}
}
