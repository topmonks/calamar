import { FetchOptions } from "../model/fetchOptions";
import { getAccount } from "../services/polkadotjsService";
import { useResource } from "./useResource";

export function useAccountPolkadotJs(
	network: string | undefined,
	address: string,
	options?: FetchOptions
) {
	return useResource(getAccount, network, address, options);
}