import { useEffect, useState } from "react";
import { FetchOptions } from "../model/fetchOptions";

import { CallsFilter, getCall } from "../services/callsService";

export function useCall(
	network: string | undefined,
	filter: CallsFilter,
	options?: FetchOptions
) {
	const [call, setCall] = useState<any>(null);

	useEffect(() => {
		if (!network || options?.skip) {
			return;
		}

		const fetchData = async () => {
			const extrinsic = await getCall(network, filter);
			setCall(extrinsic);
		};
		fetchData();
	}, [network, JSON.stringify(filter), options?.skip]);

	return call;
}
