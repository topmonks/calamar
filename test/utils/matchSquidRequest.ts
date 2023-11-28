import { Request } from "@playwright/test";

import { getNetwork } from "../../src/services/networksService";
import { isSubset } from "../../src/utils/object";

export interface SquidRequestOptions {
	squidType: string;
	network?: string;
	queryProp?: string|string[];
	variables?: any;
}

export function matchSquidRequest(request: Request, options: SquidRequestOptions) {
	const {squidType, network: networkName, queryProp, variables} = options;

	const network = networkName ? getNetwork(networkName) : undefined;

	if (!request.url().match(squidType === "archive"
		? `${network || ""}.explorer.subsquid.io`
		: `squid.subsquid.io/${squidType}-${network?.name || ""}`)
	) {
		return false;
	}

	const queryProps = Array.isArray(queryProp) ? queryProp : [queryProp];
	const query = request.postDataJSON()?.query;

	if (queryProp && queryProps.some(it => !query.match(new RegExp(`${it}\\:|(?<!\\:\\s*)${it}\\(`)))) {
		return false;
	}

	if (variables && !isSubset(variables, request.postDataJSON()?.variables)) {
		return false;
	}

	return true;
}
