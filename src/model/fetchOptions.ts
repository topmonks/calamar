export type FetchOptions = {
	/**
	 * Wait before fetch until the condition is true.
	 * Loading status is on.
	 */
	waitUntil?: boolean;

	/**
	 * Behaves like fetching and not found.
	 */
	skip?: boolean;
};
