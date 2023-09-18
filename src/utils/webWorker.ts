export class WebWorker<T, R> {
	constructor(private createWorker: () => Worker, workerFn: (e: MessageEvent<T>) => Promise<R>) {
		if (typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope) {
			self.onmessage = async (e: MessageEvent<T>) => {
				self.postMessage(await workerFn(e));
			};
		}
	}

	async run(data: T) {
		//const worker = this.createWorker();
		const worker = new Worker("./workers/runtimeSpecWorker.ts");

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
