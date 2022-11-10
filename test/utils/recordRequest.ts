export async function recordFetchRequest(fn: () => unknown|Promise<unknown>) {
	let recorded: any = null;

	const fetchBackup = global.fetch;
	(global.fetch as any) = (url: string, options: any) => {recorded = [url, options];};

	try {
		await fn();
	} catch(e) {
		// pass
	}

	global.fetch = fetchBackup;

	return recorded;
}
