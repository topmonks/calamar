import { useRouteLoaderData } from "react-router";

import { NetworkLoaderData } from "../model/rootLoaderData";

export function useNetworkLoaderData<DataEnsured extends boolean = true>() {
	return (useRouteLoaderData("network") || {}) as DataEnsured extends false ? Partial<NetworkLoaderData> : NetworkLoaderData;
}
