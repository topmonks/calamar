import { useRouteLoaderData } from "react-router";

import { RootLoaderData } from "../model/root-loader-data";

export function useRootLoaderData() {
	return useRouteLoaderData("root") as RootLoaderData;
}
