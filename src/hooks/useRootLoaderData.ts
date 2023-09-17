import { useRouteLoaderData } from "react-router";

import { NetworkLoaderData } from "../model/root-loader-data";

export function useNetworkLoaderData() {
	return useRouteLoaderData("network") as NetworkLoaderData;
}
