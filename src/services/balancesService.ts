import { Balance } from "../model/balance";
import { ItemsConnection } from "../model/itemsConnection";
import { PaginationOptions } from "../model/paginationOptions";
import { addLatestRuntimeSpecs } from "../utils/addRuntimeSpec";
import { extractConnectionItems } from "../utils/extractConnectionItems";
import { fetchBalancesSquid} from "./fetchService";
import { hasSupport } from "./networksService";

export type BalancesFilter =
	{ id_eq: string; }

export type BalancesOrder = string | string[];

export async function getBalances(
	network: string,
	filter: BalancesFilter|undefined,
	order: BalancesOrder = "total_DESC",
	pagination: PaginationOptions,
) {
	if (hasSupport(network, "balances-squid")) {
		const after = pagination.offset === 0 ? null : pagination.offset.toString();

		const response = await fetchBalancesSquid<{accountsConnection: ItemsConnection<Omit<Balance, "runtimeSpec">>}>(
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
		
		const items = extractConnectionItems(response.accountsConnection, pagination, unifyBalance);
		const balances = await addLatestRuntimeSpecs(network, items);
		
		return balances;
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

function unifyBalance(balance: Omit<Balance, "runtimeSpec">): Omit<Balance, "runtimeSpec"> {
	return balance;
}
