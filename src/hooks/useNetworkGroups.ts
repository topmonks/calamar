import { useMemo } from "react";

import { getNetwork, getNetworks } from "../services/networksService";

export function useNetworkGroups() {
	return useMemo(() => {
		return ["polkadot", "kusama", null].map((relayChain, index, all) => {
			const relayChainNetwork = relayChain ? getNetwork(relayChain) : undefined;
			const networks = getNetworks()
				.filter(it =>
					relayChain
						? (it.relayChain === relayChain && it.name !== relayChain)
						: !all.slice(0, -1).includes(it.relayChain || "")
				);

			if (relayChainNetwork) {
				networks.unshift(relayChainNetwork);
			}

			return {
				relayChainNetwork,
				networks
			};
		});
	}, []);
}
