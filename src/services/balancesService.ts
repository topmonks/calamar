import Decimal from "decimal.js";

import { AccountBalance } from "../model/accountBalance";
import { ExplorerSquidAccountBalance } from "../model/explorer-squid/explorerSquidAccountBalance";
import { Network } from "../model/network";
import { encodeAddress } from "../utils/formatAddress";

import { fetchBalancesSquid } from "./fetchService";
import { getNetworks, hasSupport } from "./networksService";

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
			const response = await fetchBalancesSquid<ExplorerSquidAccountBalance>(network.name, `
				query ($address: String!) {
					balance: accountById(id: $address) {
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

			accountBalance.balance = unifyExplorerSquidAccountBalance(response, network);
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

function unifyExplorerSquidAccountBalance(accountBalance: ExplorerSquidAccountBalance, network: Network): AccountBalance["balance"] {
	const scale = new Decimal(10).pow(network.decimals * -1);

	return {
		free: new Decimal(accountBalance.balance?.free || 0).mul(scale),
		reserved: new Decimal(accountBalance.balance?.reserved || 0).mul(scale),
		total: new Decimal(accountBalance.balance?.total || 0).mul(scale),
		updatedAt: accountBalance.balance?.updatedAt
	};
}
