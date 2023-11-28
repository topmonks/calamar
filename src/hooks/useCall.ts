import { CallsFilter, getCall } from "../services/callsService";

import { UseResourceOptions, useResource } from "./useResource";

export function useCall(
	network: string,
	filter: CallsFilter,
	options?: UseResourceOptions
) {
	return useResource(getCall, [network, filter], options);
}
