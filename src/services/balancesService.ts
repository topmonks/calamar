import Decimal from "decimal.js";

import { AccountBalance } from "../model/accountBalance";
import { ExplorerSquidAccountBalance } from "../model/explorer-squid/explorerSquidAccountBalance";
import { ExplorerSquidChainInfo } from "../model/explorer-squid/explorerSquidChainInfo";
import { SquidEntry } from "../model/squid";
import { encodeAddress } from "../utils/formatAddress";

import { fetchBalancesSquid } from "./fetchService";
import { getBalancesSquid, getSupportedNetworks } from "./networksService";
import { getRuntimeSpec } from "./runtimeService";

export async function getBalances(address: string) {
	const networks = getSupportedNetworks();

	const accountBalances = networks.map<AccountBalance>((network) => ({
		id: `${address}_${network.name}`,
		network: network.name,
		balanceSupported: !!getBalancesSquid(network.name),
	}));

	const response = await Promise.allSettled(networks.map(async (network, index) => {
		const accountBalance = accountBalances[index]!;

		const runtimeSpec = await getRuntimeSpec(network.name, "latest");
		const encodedAddress = encodeAddress(address, runtimeSpec.metadata.ss58Prefix);

		accountBalance.encodedAddress = encodedAddress;
		accountBalance.ss58prefix = runtimeSpec.metadata.ss58Prefix;

		const balancesSquid = getBalancesSquid(network.name);

		if (balancesSquid) {
			const chainInfo = await getChainInfo(balancesSquid);
			accountBalance.chainDecimals = parseInt(chainInfo?.tokens[0]?.decimals || "12");
			accountBalance.chainToken = chainInfo?.tokens[0]?.symbol;

			const response = await fetchBalancesSquid<ExplorerSquidAccountBalance>(balancesSquid.network, `
				query ($address: String!) {
					balance: accountById(id: $address) {
						free
						reserved
						total
						updatedAt
					}
					chainInfo {
						tokens {
							decimals
							symbol
						}
					}
				}
			`, {
				address: encodedAddress
			});

			console.log("balance", balancesSquid.network, response.balance?.total);

			accountBalance.balance = unifyExplorerSquidAccountBalance(response);
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

async function getChainInfo(balancesSquid: SquidEntry) {
	const response = await fetchBalancesSquid<{chainInfo: ExplorerSquidChainInfo}>(balancesSquid.network, `
		query {
			chainInfo {
				tokens {
					decimals
					symbol
				}
			}
		}
	`);

	return response.chainInfo;
}

function unifyExplorerSquidAccountBalance(accountBalance: ExplorerSquidAccountBalance): AccountBalance["balance"] {
	const decimals = new Decimal(accountBalance.chainInfo.tokens[0]?.decimals || 12);
	const scale = new Decimal(10).pow(decimals.neg());

	return {
		free: new Decimal(accountBalance.balance?.free || 0).mul(scale),
		reserved: new Decimal(accountBalance.balance?.reserved || 0).mul(scale),
		total: new Decimal(accountBalance.balance?.total || 0).mul(scale),
		updatedAt: accountBalance.balance?.updatedAt
	};
}
