import Decimal from "decimal.js";

import { AccountBalance } from "../model/accountBalance";
import { Balance } from "../model/balance";
import { BalancesSquidBalance } from "../model/explorer-squid/explorerSquidAccountBalance";
import { ItemsConnection } from "../model/itemsConnection";
import { PaginationOptions } from "../model/paginationOptions";

import { addRuntimeSpecs } from "../utils/addRuntimeSpec";
import { extractConnectionItems } from "../utils/extractConnectionItems";
import { encodeAddress } from "../utils/formatAddress";

import { fetchBalancesSquid } from "./fetchService";
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
	if (hasSupport(network, "balances-squid")) {
		const after = pagination.offset === 0 ? null : pagination.offset.toString();

		const response = await fetchBalancesSquid<{accountsConnection: ItemsConnection<BalancesSquidBalance>}>(
			network,
			`query ($first: Int!, $after: String, $filter: AccountWhereInput, $order: [AccountOrderByInput!]!) {
				accountsConnection(first: $first, after: $after, where: $filter, orderBy: $order) {
					edges {
						node {
							id
							free
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

		const items = extractConnectionItems(response.accountsConnection, pagination, unifyBalancesSquidBalance, network);
		const balances = await addRuntimeSpecs(network, items, () => "latest");

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
		balanceSupported: !!hasSupport(network.name, "balances-squid"),
	}));

	const response = await Promise.allSettled(networks.map(async (network, index) => {
		const accountBalance = accountBalances[index]!;

		const encodedAddress = encodeAddress(address, network.prefix);

		accountBalance.encodedAddress = encodedAddress;

		if (accountBalance.balanceSupported) {
			const response = await fetchBalancesSquid<{balance?: BalancesSquidBalance}>(network.name, `
				query ($address: String!) {
					balance: accountById(id: $address) {
						id
						free
						reserved
						total
						updatedAt
					}
				}
			`, {
				address: encodedAddress
			});

			console.log("balance", network, response.balance?.total);

			accountBalance.balance = response.balance
				? unifyBalancesSquidBalance(response.balance, network.name)
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

function unifyBalancesSquidBalance(balance: BalancesSquidBalance, networkName: string): Omit<Balance, "runtimeSpec"> {
	const network = getNetwork(networkName)!;
	const scale = new Decimal(10).pow(network.decimals * -1);

	return {
		id: balance.id,
		free: new Decimal(balance.free || 0).mul(scale),
		reserved: new Decimal(balance.reserved || 0).mul(scale),
		total: new Decimal(balance.total || 0).mul(scale),
		updatedAt: balance.updatedAt
	};
}
