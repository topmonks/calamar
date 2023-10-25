import { useRouteLoaderData } from "react-router";

import { NetworkLoaderData } from "../model/rootLoaderData";

export function useNetworkLoaderData() {
	return useRouteLoaderData("network") as NetworkLoaderData;
}
