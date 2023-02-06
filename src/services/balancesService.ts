import { AccountBalance } from "../model/accountBalance";
import { encodeAddress } from "../utils/formatAddress";

import { fetchBalancesSquid } from "./fetchService";
import { getBalancesSquid, getSupportedNetworks } from "./networksService";
import { getRuntimeSpec } from "./runtimeService";

export async function getBalances(address: string) {
	const networks = getSupportedNetworks();

	const accountBalances = networks.map<AccountBalance>((network) => ({
		id: `${address}_${network.name}`,
		network: network.name,
		balanceSupported: !!getBalancesSquid(network.name)
	}));

	const response = await Promise.allSettled(networks.map(async (network, index) => {
		const accountBalance = accountBalances[index]!;

		const runtimeSpec = await getRuntimeSpec(network.name, "latest");
		const encodedAddress = encodeAddress(address, runtimeSpec.metadata.ss58Prefix);

		accountBalance.encodedAddress = encodedAddress;
		accountBalance.ss58prefix = runtimeSpec.metadata.ss58Prefix;

		const balancesSquid = getBalancesSquid(network.name);

		if (balancesSquid) {
			try {
				const response = await fetchBalancesSquid<{balance: AccountBalance["balance"]}>(balancesSquid.network, `
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

				console.log("balance", balancesSquid.network, response.balance?.total);

				accountBalance.balance = response.balance;
			} catch (e: any) {
				accountBalance.error = e.message;
			}
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
