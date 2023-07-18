import { useRouteLoaderData } from "react-router";

import { RootLoaderData } from "../model/root-loader-data";

export function useRootLoaderData() {
	return (useRouteLoaderData("root") ? useRouteLoaderData("root") : useRouteLoaderData("home")) as RootLoaderData;
}
