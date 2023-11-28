import { ItemsConnection } from "../model/itemsConnection";
import { ItemsResponse } from "../model/itemsResponse";
import { MainSquidTransfer } from "../model/main-squid/mainSquidTransfer";
import { PaginationOptions } from "../model/paginationOptions";
import { Transfer } from "../model/transfer";

import { decodeAddress } from "../utils/address";
import { extractConnectionItems, paginationToConnectionCursor } from "../utils/itemsConnection";
import { emptyItemsResponse } from "../utils/itemsResponse";
import { rawAmountToDecimal } from "../utils/number";

import { fetchArchive, fetchMainSquid, registerItemFragment, registerItemsConnectionFragment } from "./fetchService";
import { getNetwork, hasSupport } from "./networksService";

export type TransfersFilter =
	{ accountAddress: string };

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

	return emptyItemsResponse();
}

/*** PRIVATE ***/

registerItemFragment("MainSquidTransfer", "Transfer", `
	id
	direction
	account {
		publicKey
	}
	transfer {
		id
		blockNumber
		timestamp
		extrinsicHash
		to {
			publicKey
		}
		from {
			publicKey
		}
		amount
		success
	}
`);

registerItemsConnectionFragment("MainSquidTransfersConnection", "TransfersConnection", "...MainSquidTransfer");

async function getMainSquidTransfers(
	network: string,
	filter: TransfersFilter | undefined,
	order: TransfersOrder = "id_DESC",
	pagination: PaginationOptions,
) {
	const {first, after} = paginationToConnectionCursor(pagination);

	const response = await fetchMainSquid<{transfersConnection: ItemsConnection<MainSquidTransfer>}>(
		network,
		`query ($first: Int!, $after: String, $filter: TransferWhereInput, $order: [TransferOrderByInput!]!) {
			transfersConnection(first: $first, after: $after, where: $filter, orderBy: $order) {
				...MainSquidTransfersConnection
				${(filter != undefined) ?  "totalCount" : ""}
			}
		}`,
		{
			first,
			after,
			filter: transfersFilterToMainSquidFilter(filter),
			order,
		}
	);

	return await extractConnectionItems(
		response.transfersConnection,
		pagination,
		unifyMainSquidTransfer,
		network
	);
}

function unifyMainSquidTransfer(transfer: MainSquidTransfer, networkName: string): Transfer {
	const network = getNetwork(networkName);

	return {
		...transfer,
		eventId: transfer.transfer.id,
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

	if ("accountAddress" in filter) {
		const publicKey = decodeAddress(filter.accountAddress);

		return {
			account: {
				publicKey_eq: publicKey
			}
		};
	}

	return filter;
}
