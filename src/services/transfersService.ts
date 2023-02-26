import { ItemsConnection } from "../model/itemsConnection";
import { MainSquidTransfer } from "../model/mainSquidTransfer";
import { PaginationOptions } from "../model/paginationOptions";
import { Transfer } from "../model/transfer";
import { addLatestRuntimeSpecs } from "../utils/addRuntimeSpec";
import { extractConnectionItems } from "../utils/extractConnectionItems";
import { fetchMainSquid } from "./fetchService";
import { hasSupport } from "./networksService";

export type TransfersFilter =
	{ account: { publicKey_eq: string } };

export type TransfersOrder = string | string[];

export async function getTransfers(
	network: string,
	filter: TransfersFilter,
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
	filter: TransfersFilter,
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

	const items = extractConnectionItems(response.transfersConnection, pagination, unifyMainSquidTransfer);

	const transfer = await addLatestRuntimeSpecs(network, items);

	return transfer;
}

function unifyMainSquidTransfer(transfer: MainSquidTransfer): Omit<Transfer, "runtimeSpec"> {
	return {
		...transfer,
		accountPublicKey: transfer.account.publicKey,
		blockNumber: transfer.transfer.blockNumber,
		timestamp: transfer.transfer.timestamp,
		extrinsicHash: transfer.transfer.extrinsicHash,
		amount: transfer.transfer.amount,
		success: transfer.transfer.success,
		fromPublicKey: transfer.transfer.from.publicKey,
		toPublicKey: transfer.transfer.to.publicKey,
	};
}


