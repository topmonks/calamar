import { FetchOptions } from "../model/fetchOptions";
import { getAccount } from "../services/accountService";

import { useResource } from "./useResource";

export function useAccount(
	network: string | undefined,
	address: string,
	options?: FetchOptions
) {
	return useResource(getAccount, network, address, options);
}
