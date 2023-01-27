import { ArchiveConnection } from "../model/archiveConnection";
import { Extrinsic } from "../model/extrinsic";
import { PaginationOptions } from "../model/paginationOptions";
import { addRuntimeSpecs } from "../utils/addRuntimeSpec";
import { lowerFirst, upperFirst } from "../utils/string";
import { unifyConnection } from "../utils/unifyConnection";

import { fetchArchive } from "./fetchService";
import { getRuntimeSpec } from "./runtimeService";

export type ExtrinsicsFilter = any;
export type ExtrinsicsOrder = string | string[];

export async function getExtrinsic(network: string, filter?: ExtrinsicsFilter) {
	const extrinsics = await getExtrinsicsWithoutTotalCount(network, filter, undefined, {
		offset: 0,
		limit: 1
	});
	return extrinsics.data[0];
}

export async function getExtrinsicsByName(
	network: string,
	name: string,
	order: ExtrinsicsOrder = "id_DESC",
	pagination: PaginationOptions
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

	return getExtrinsicsWithoutTotalCount(network, filter, order, pagination);
}

export async function getExtrinsicsWithoutTotalCount(
	network: string,
	filter: ExtrinsicsFilter,
	order: ExtrinsicsOrder = "id_DESC",
	pagination: PaginationOptions
) {
	const response = await fetchArchive<{ extrinsics: Omit<Extrinsic, "runtimeSpec">[] }>(
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
			limit: pagination.limit + 1, // get one item more to test if next page exists
			offset: pagination.offset,
			filter,
			order,
		}
	);

	const items = response.extrinsics;
	const hasNextPage = items.length > pagination.limit;

	if (hasNextPage) {
		// remove testing item from next page
		items.pop();
	}

	return addRuntimeSpecs(
		network,
		{
			data: items,
			pagination: {
				...pagination,
				hasNextPage
			}
		},
		it => it.block.spec.specVersion
	);
}

export async function getExtrinsics(
	network: string,
	filter: ExtrinsicsFilter,
	order: ExtrinsicsOrder = "id_DESC",
	pagination: PaginationOptions
) {
	const after = pagination.offset === 0 ? null : pagination.offset.toString();

	const response = await fetchArchive<{ extrinsicsConnection: ArchiveConnection<Omit<Extrinsic, "runtimeSpec">> }>(
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
			first: pagination.limit,
			after,
			filter,
			order,
		}
	);

	return addRuntimeSpecs(
		network,
		unifyConnection(
			response.extrinsicsConnection,
			pagination.limit,
			pagination.offset
		),
		it => it.block.spec.specVersion
	);
}

