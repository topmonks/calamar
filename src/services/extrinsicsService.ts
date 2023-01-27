import { ArchiveConnection } from "../model/archiveConnection";
import { Extrinsic } from "../model/extrinsic";
import { ItemsResponse } from "../model/itemsResponse";
import { addRuntimeSpecs } from "../utils/addRuntimeSpec";
import { fetchGraphql } from "../utils/fetchGraphql";
import { lowerFirst, upperFirst } from "../utils/string";
import { unifyConnection } from "../utils/unifyConnection";

import { getRuntimeSpec } from "./runtimeService";

export type ExtrinsicsFilter = any;
export type ExtrinsicsOrder = string | string[];

export async function getExtrinsic(network: string, filter?: ExtrinsicsFilter) {
	const extrinsics = await getExtrinsicsWithoutTotalCount(network, 1, 0, filter);
	return extrinsics.data[0];
}

export async function getExtrinsicsByName(
	network: string,
	limit: number,
	offset: number,
	name: string,
	order: ExtrinsicsOrder = "id_DESC"
) {
	let [pallet = "", call = ""] = name.split(".");

	// try to fix casing according to latest runtime spec
	const latestRuntimeSpec = await getRuntimeSpec(network, "latest");

	const runtimePallet = latestRuntimeSpec.metadata.pallets.find(it => it.name.toLowerCase() === pallet.toLowerCase());
	const runtimeCall = runtimePallet?.calls.find(it => it.name.toLowerCase() === call.toLowerCase());

	// use found names from runtime metadata or try to fix the first letter casing as fallback
	pallet = runtimePallet?.name.toString() || upperFirst(pallet);
	call = runtimeCall?.name.toString() || lowerFirst(call);

	const filter = {
		call: {
			name_eq: `${pallet}.${call}`
		}
	};

	return getExtrinsicsWithoutTotalCount(network, limit, offset, filter, order);
}

export async function getExtrinsicsWithoutTotalCount(
	network: string,
	limit: number,
	offset: number,
	filter?: ExtrinsicsFilter,
	order: ExtrinsicsOrder = "id_DESC"
) {
	const response = await fetchGraphql<{ extrinsics: Omit<Extrinsic, "runtimeSpec">[] }>(
		network,
		`query ($limit: Int!, $offset: Int!, $filter: ExtrinsicWhereInput, $order: [ExtrinsicOrderByInput!]) {
			extrinsics(limit: $limit, offset: $offset, where: $filter, orderBy: $order) {
				id
				hash
				call {
					name
					args
				}
				block {
					id
					hash
					height
					timestamp
					spec {
						specVersion
					}
				}
				signature
				indexInBlock
				success
				tip
				fee
				error
				version
			}
		}`,
		{
			limit: limit + 1, // get one item more to test if next page exists
			offset,
			filter,
			order,
		}
	);

	const items = response.extrinsics;
	const hasNextPage = items.length > limit;

	if (hasNextPage) {
		// remove testing item from next page
		items.pop();
	}

	return addRuntimeSpecs(
		network,
		{
			data: items,
			pagination: {
				offset,
				limit,
				hasNextPage
			}
		},
		it => it.block.spec.specVersion
	);
}

export async function getExtrinsics(
	network: string,
	limit: number,
	offset: number,
	filter?: ExtrinsicsFilter,
	order: ExtrinsicsOrder = "id_DESC"
) {
	const after = offset === 0 ? null : offset.toString();

	const response = await fetchGraphql<{ extrinsicsConnection: ArchiveConnection<Omit<Extrinsic, "runtimeSpec">> }>(
		network,
		`query ($first: Int!, $after: String, $filter: ExtrinsicWhereInput, $order: [ExtrinsicOrderByInput!]!) {
			extrinsicsConnection(first: $first, after: $after, where: $filter, orderBy: $order) {
				edges {
					node {
						id
						hash
						call {
							name
							args
						}
						block {
							id
							hash
							height
							timestamp
							spec {
								specVersion
							}
						}
						signature
						indexInBlock
						success
						tip
						fee
						error
						version
					}
				}
				pageInfo {
					endCursor
					hasNextPage
					hasPreviousPage
					startCursor
				}
				totalCount
			}
		}`,
		{
			first: limit,
			after,
			filter,
			order,
		}
	);

	return addRuntimeSpecs(
		network,
		unifyConnection(response.extrinsicsConnection, limit, offset),
		it => it.block.spec.specVersion
	);
}

