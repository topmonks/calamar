import { SWRConfiguration } from "swr";

export interface FetchOptions extends SWRConfiguration {
	/**
	 * Use this if the data are not needed based on some condition.
	 *
	 * Behaves like normal except the data fetch is not actually
	 * performed and results with "Not found".
	 */
	skip?: boolean;
}
