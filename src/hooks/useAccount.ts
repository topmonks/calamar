import { FetchOptions } from "../model/fetchOptions";
import { getAccount } from "../services/accountService";

import { useItem } from "./useItem";

export function useAccount(
	network: string | undefined,
	address: string,
	options?: FetchOptions
) {
	return useItem(getAccount, network, address, options);
}
