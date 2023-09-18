/**
 * Web worker handler
 *
 * Used to run the web worker in a type-safe way
 */
export class WebWorker<T, R> {
	/**
	 * @param createWorker Function returning the worker instance, required by CRA to properly register the worker
	 */
	constructor(protected createWorker: () => Worker) {}

	async run(data: T) {
		const worker = this.createWorker();

		worker.postMessage(data);

		const responseData = await new Promise<R>((resolve) => {
			worker.onmessage = (e: MessageEvent<R>) => {
				resolve(e.data);
			};
		});

		worker.terminate();

		return responseData;
	}
}

/**
 * Web worker runtime
 *
 * Basically a type-safe wrapper around the web worker's runtime
 *
 * Must be separated from WebWorker class to prevent circular dependency between chunks
 */
export class WebWorkerRuntime<T, R> {
	constructor(runtimeFn: (e: MessageEvent<T>) => Promise<R>) {
		self.onmessage = async (e: MessageEvent<T>) => {
			self.postMessage(await runtimeFn(e));
		};
	}
}
