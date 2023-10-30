import { Location, RouteObject, matchRoutes } from "react-router-dom";

export function setLocationParams(location: Location, newParams: Record<string, string>, routes: RouteObject[]) {
	const match = matchRoutes(routes, location);

	if (!match) {
		return;
	}

	const pathPattern = match.map(it => it.route.path).join("/").replace(/\/+/g, "/");

	const currentParams = match[match.length - 1]?.params || {};

	const paramEntries = Object.entries({
		...currentParams,
		...newParams
	});

	const path = paramEntries.reduce((path, [param, value]) => {
		return path.replace(new RegExp(`:${param}\\??`), value || "");
	}, pathPattern);

	return path;
}
