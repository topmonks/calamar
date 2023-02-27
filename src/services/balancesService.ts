import { Balance } from "@polkadot/types/interfaces";
import { ItemsConnection } from "../model/itemsConnection";
import { PaginationOptions } from "../model/paginationOptions";
import { extractConnectionItems } from "../utils/extractConnectionItems";
import { fetchBalancesSquid} from "./fetchService";
import { hasSupport } from "./networksService";

export type BalancesFilter =
	{ id_eq: string; }

export type BalancesOrder = string | string[];

export async function getBalances(
	network: string,
	filter: BalancesFilter|undefined,
	order: BalancesOrder = "free_DESC",
	pagination: PaginationOptions,
) {
	if (hasSupport(network, "balances-squid")) {
		const after = pagination.offset === 0 ? null : pagination.offset.toString();

		const response = await fetchBalancesSquid<{accountsConnection: ItemsConnection<Balance>}>(
			network,
			`query ($first: Int!, $after: String, $filter: AccountWhereInput, $order: [AccountOrderByInput!]!) {
                accountsConnection(first: $first, after: $after, where: $filter, orderBy: $order) {
                    edges {
                        node {
                            free
                            id
                            reserved
                            total
                            updatedAt
                        }
                    }
                    pageInfo {
                        endCursor
                        hasNextPage
                        hasPreviousPage
                        startCursor
                    }
                    ${filter !== undefined ? "totalCount" : "" }
                }
            }`,
			{
				first: pagination.limit,
				after,
				filter,
				order,
			}
		);
        
		const data = extractConnectionItems(response.accountsConnection, pagination, unifyBalance);

		return data;
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

function unifyBalance(balance: Balance): Balance {
	return balance;
}

