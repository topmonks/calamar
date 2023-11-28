import { getAccount } from "../services/accountService";

import { UseResourceOptions, useResource } from "./useResource";

export function useAccount(
	network: string,
	address: string,
	options?: UseResourceOptions
) {
	return useResource(getAccount, [network, address], options);
}
