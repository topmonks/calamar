export type RequestGenerator = () => unknown|Promise<unknown>;
export type RequestMatcher = (url: string, options: globalThis.RequestInit) => boolean;

/**
 * Records first `fetch` request performed in `requestGenerator` function which match the `requestFetcher` param (any request by default).
 */
export async function recordFetchRequest(requestGenerator: RequestGenerator, requestMatcher: RequestMatcher = () => true) {
	let recorded: any = null;

	const fetchBackup = global.fetch;
	(global.fetch as any) = (url: string, options: any) => {
		if (!recorded && requestMatcher(url, options)) {
			recorded = [url, options];
		}

		return fetchBackup(url, options);
	};

	try {
		await requestGenerator();
	} catch(e) {
		// pass
	}

	global.fetch = fetchBackup;

	return recorded;
}
