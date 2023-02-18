import { ItemsConnection } from "../model/itemsConnection";
import { MainSquidTransfer } from "../model/mainSquidTransfer";
import { PaginationOptions } from "../model/paginationOptions";
import { Transfer } from "../model/transfer";
import { extractConnectionItems } from "../utils/extractConnectionItems";
import { fetchMainSquid } from "./fetchService";
import { hasSupport } from "./networksService";

export type TransfersFilter =
	{ account: { id_eq: string } };

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

	const response = await fetchMainSquid<{accountTransfersConnection: ItemsConnection<MainSquidTransfer>}>(
		network,
		`query ($first: Int!, $after: String, $filter: AccountTransferWhereInput, $order: [AccountTransferOrderByInput!]!) {
			accountTransfersConnection(first: $first, after: $after, where: $filter, orderBy: $order) {
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
                                id
                            }
                            from {
                                id
                            }
                        }
                        account {
                            id
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


	
	console.log("HERE: ", response.accountTransfersConnection);
	console.log(filter);


	return extractConnectionItems(response.accountTransfersConnection, pagination, unifyMainSquidTransfer);
}

function unifyMainSquidTransfer(transfer: MainSquidTransfer): Transfer {
	return {
		...transfer,
		accountId: transfer.account.id,
		blockNumber: transfer.transfer.blockNumber,
		timestamp: transfer.transfer.timestamp,
		extrinsicHash: transfer.transfer.extrinsicHash,
		amount: transfer.transfer.amount,
		success: transfer.transfer.success,
		fromId: transfer.transfer.from.id,
		toId: transfer.transfer.to.id,
	};
}


