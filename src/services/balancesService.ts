import Decimal from "decimal.js";

import { AccountBalance } from "../model/accountBalance";
import { Balance } from "../model/balance";
import { StatsSquidAccountBalance } from "../model/stats-squid/statsSquidAccountBalance";
import { ItemsConnection } from "../model/itemsConnection";
import { PaginationOptions } from "../model/paginationOptions";

import { extractConnectionItems } from "../utils/extractConnectionItems";
import { encodeAddress } from "../utils/formatAddress";
import { rawAmountToDecimal } from "../utils/number";

import { fetchStatsSquid } from "./fetchService";
import { getNetwork, getNetworks, hasSupport } from "./networksService";


export type BalancesFilter =
	{ id_eq: string; }

export type BalancesOrder = string | string[];

export async function getBalances(
	network: string,
	filter: BalancesFilter|undefined,
	order: BalancesOrder = "total_DESC",
	pagination: PaginationOptions,
) {
	if (hasSupport(network, "stats-squid")) {
		const after = pagination.offset === 0 ? null : pagination.offset.toString();

		const response = await fetchStatsSquid<{accountsConnection: ItemsConnection<StatsSquidAccountBalance>}>(
			network,
			`query ($first: Int!, $after: String, $filter: AccountWhereInput, $order: [AccountOrderByInput!]!) {
				accountsConnection(first: $first, after: $after, where: $filter, orderBy: $order) {
					edges {
						node {
							id
							free
							reserved
							total
							updatedAtBlock
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

		const balances = extractConnectionItems(response.accountsConnection, pagination, unifyStatsSquidAccountBalance, network);

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

export async function getAccountBalances(address: string) {
	const networks = getNetworks();

	const accountBalances = networks.map<AccountBalance>((network) => ({
		id: `${address}_${network.name}`,
		network,
		balanceSupported: !!hasSupport(network.name, "stats-squid"),
	}));

	const response = await Promise.allSettled(networks.map(async (network, index) => {
		const accountBalance = accountBalances[index]!;

		const encodedAddress = encodeAddress(address, network.prefix);

		accountBalance.encodedAddress = encodedAddress;

		if (accountBalance.balanceSupported) {
			const response = await fetchStatsSquid<{balance?: StatsSquidAccountBalance}>(network.name, `
				query ($address: String!) {
					balance: accountById(id: $address) {
						id
						free
						reserved
						total
						updatedAtBlock
					}
				}
			`, {
				address: encodedAddress
			});

			accountBalance.balance = response.balance
				? unifyStatsSquidAccountBalance(response.balance, network.name)
				: {
					id: address,
					total: new Decimal(0),
					free: new Decimal(0),
					reserved: new Decimal(0),
				};
		}
	}));

	response.forEach((result, index) => {
		const accountBalance = accountBalances[index]!;

		if (result.status === "rejected") {
			accountBalance.error = result.reason;
		}
	});

	return accountBalances;
}

/*** PRIVATE ***/

function unifyStatsSquidAccountBalance(balance: StatsSquidAccountBalance, networkName: string): Balance {
	const network = getNetwork(networkName);

	return {
		id: balance.id,
		free: rawAmountToDecimal(network, balance.free),
		reserved: rawAmountToDecimal(network, balance.reserved),
		total: rawAmountToDecimal(network, balance.total),
		updatedAtBlock: balance.updatedAtBlock
	};
}
