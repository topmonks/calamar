import { ItemsConnection } from "../model/itemsConnection";
import { ItemsResponse } from "../model/itemsResponse";
import { MainSquidTransfer } from "../model/main-squid/mainSquidTransfer";
import { PaginationOptions } from "../model/paginationOptions";
import { Transfer } from "../model/transfer";

import { decodeAddress } from "../utils/formatAddress";
import { extractConnectionItems } from "../utils/extractConnectionItems";

import { fetchArchive, fetchMainSquid } from "./fetchService";
import { getNetwork, hasSupport } from "./networksService";
import { rawAmountToDecimal } from "../utils/number";

export type TransfersFilter =
	{ accountAddress_eq: string };

export type TransfersOrder = string | string[];

export async function getTransfers(
	network: string,
	filter: TransfersFilter | undefined,
	order: TransfersOrder = "id_DESC",
	pagination: PaginationOptions,
) {
	if(hasSupport(network, "main-squid")) {
		return getMainSquidTransfers(network, filter, order, pagination);
	}

	return {
		data: [],
		pagination: {
			offset: 0,
			limit: 0,
			hasNextPage: false,
			totalCount: 0,
		}
	};
}

/*** PRIVATE ***/

async function getMainSquidTransfers(
	network: string,
	filter: TransfersFilter | undefined,
	order: TransfersOrder = "id_DESC",
	pagination: PaginationOptions,
) {
	const after = pagination.offset === 0 ? null : pagination.offset.toString();

	const response = await fetchMainSquid<{transfersConnection: ItemsConnection<MainSquidTransfer>}>(
		network,
		`query ($first: Int!, $after: String, $filter: TransferWhereInput, $order: [TransferOrderByInput!]!) {
			transfersConnection(first: $first, after: $after, where: $filter, orderBy: $order) {
				edges {
					node {
						id
						transfer {
							id
							amount
							blockNumber
							success
							timestamp
							extrinsicHash
							to {
								publicKey
							}
							from {
								publicKey
							}
						}
						account {
							publicKey
						}
						direction
					}
				}
				pageInfo {
					endCursor
					hasNextPage
					hasPreviousPage
					startCursor
				}
				${(filter != undefined) ?  "totalCount" : ""}
			}
		}`,
		{
			first: pagination.limit,
			after,
			filter: transfersFilterToMainSquidFilter(filter),
			order,
		}
	);

	const items = extractConnectionItems(response.transfersConnection, pagination, unifyMainSquidTransfer, network);
	const transfers = await addExtrinsicsInfo(network, items);

	return transfers;
}

async function addExtrinsicsInfo(network: string, items: ItemsResponse<Omit<Transfer, "extrinsic">>) {
	const extrinsicHashes = items.data.map((transfer) => transfer.extrinsicHash).filter(Boolean) as string[];

	const extrinsicsInfoByHash = await getArchiveExtrinsicsInfo(network, extrinsicHashes);

	return {
		...items,
		data: items.data.map(transfer => ({
			...transfer,
			extrinsic: transfer.extrinsicHash ? extrinsicsInfoByHash[transfer.extrinsicHash] : null
		}))
	};
}

async function getArchiveExtrinsicsInfo(network: string, extrinsicHashes: string[]) {
	const response = await fetchArchive<{extrinsics: {id: string, hash: string}[]}>(
		network,
		`query($hashes: [String!], $limit: Int!) {
			extrinsics(where: { hash_in: $hashes }, limit: $limit) {
				id,
				hash
			}
		}`,
		{
			hashes: extrinsicHashes,
			limit: extrinsicHashes.length
		}
	);

	return response.extrinsics.reduce((extrinsicInfoByHash, extrinsic) => {
		extrinsicInfoByHash[extrinsic.hash] = extrinsic;
		return extrinsicInfoByHash;
	}, {} as Record<string, any>);
}

function unifyMainSquidTransfer(transfer: MainSquidTransfer, networkName: string): Omit<Transfer, "extrinsic"> {
	const network = getNetwork(networkName);

	return {
		...transfer,
		accountPublicKey: transfer.account.publicKey,
		blockNumber: transfer.transfer.blockNumber,
		timestamp: transfer.transfer.timestamp,
		extrinsicHash: transfer.transfer.extrinsicHash,
		amount: rawAmountToDecimal(network, transfer.transfer.amount),
		success: transfer.transfer.success,
		fromPublicKey: transfer.transfer.from.publicKey,
		toPublicKey: transfer.transfer.to.publicKey,
	};
}

function transfersFilterToMainSquidFilter(filter?: TransfersFilter) {
	if (!filter) {
		return undefined;
	}

	if ("accountAddress_eq" in filter) {
		const publicKey = decodeAddress(filter.accountAddress_eq);

		return {
			account: {
				publicKey_eq: publicKey
			}
		};
	}

	return filter;
}
