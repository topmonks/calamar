import { ItemsResponse } from "../model/itemsResponse";
import { getRuntimeSpec, getRuntimeSpecs } from "../services/runtimeService";

import { uniq } from "./uniq";

export async function addRuntimeSpec<T>(network: string, response: T|undefined, getSpecVersion: (data: T) => number|"latest") {
	if (response === undefined) {
		return undefined;
	}

	const specVersion = getSpecVersion(response);
	const spec = await getRuntimeSpec(network, specVersion);

	return {
		...response,
		runtimeSpec: spec!
	};
}


export async function addRuntimeSpecs<T>(network: string, response: ItemsResponse<T>, getSpecVersion: (data: T) => number) {
	const specVersions = uniq(response.data.map(getSpecVersion));

	const specs = await getRuntimeSpecs(network, specVersions);

	const items = response.data.map(it => ({
		...it,
		runtimeSpec: specs[getSpecVersion(it)]!
	}));


	return {
		...response,
		data: items
	};
}

export async function addLatestRuntimeSpecs<T>(network: string, response: ItemsResponse<T>) {
	const spec = await getRuntimeSpec(network, "latest");

	const items = response.data.map(it => ({
		...it,
		runtimeSpec: spec,
	}));


	return {
		...response,
		data: items
	};
}
