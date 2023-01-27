export type FetchOptions = {
	/**
	 * Use this if you need to wait before fetch
	 * until some condition is true.
	 *
	 * Loading status is on until that.
	 */
	waitUntil?: boolean;

	/**
	 * Use this if the data are not needed based on some condition.
	 *
	 * Behaves like normal except the data fetch is not actually
	 * performed and results with "Not found".
	 */
	skip?: boolean;
};
