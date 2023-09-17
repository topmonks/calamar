import { ItemsResponse } from "../model/itemsResponse";
import { RuntimeSpec } from "../model/runtimeSpec";
import { getRuntimeSpec, getRuntimeSpecs } from "../services/runtimeService";

import { uniq } from "./uniq";

export async function addItemMetadata<T, M>(
	network: string,
	response: T|undefined,
	getSpecVersion: (data: T) => number|"latest",
	getMetadata: (data: T, runtimeSpec: RuntimeSpec) => M
) {
	if (response === undefined) {
		return undefined;
	}

	const specVersion = getSpecVersion(response);
	const spec = await getRuntimeSpec(network, specVersion);

	return {
		...response,
		metadata: getMetadata(response, spec!)
	};
}


export async function addItemsMetadata<T, M>(
	network: string,
	response: ItemsResponse<T>,
	getSpecVersion: (data: T) => number|"latest",
	getMetadata: (data: T, runtimeSpec: RuntimeSpec) => M
) {
	const specVersions = uniq(response.data.map(getSpecVersion));

	const specs = await getRuntimeSpecs(network, specVersions);

	const items = response.data.map(it => ({
		...it,
		metadata: getMetadata(it, specs[getSpecVersion(it)]!)
	}));

	return {
		...response,
		data: items
	};
}
