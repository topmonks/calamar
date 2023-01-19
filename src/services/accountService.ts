import { isAddress } from "@polkadot/util-crypto";

import { Account } from "../model/account";
import { addRuntimeSpec } from "../utils/addRuntimeSpec";

import { decodeAddress } from "../utils/formatAddress";

import { getExtrinsic } from "./extrinsicsService";

export async function getAccount(network: string, address: string): Promise<Account|undefined> {
	if (!isAddress(address)) {
		return undefined;
	}

	// if the address is encoded, decode it
	const decodedAddress = decodeAddress(address);

	if (decodedAddress) {
		address = decodedAddress;
	}

	const filter = {
		OR: [
			{ signature_jsonContains: `{"address": "${address}" }` },
			{ signature_jsonContains: `{"address": { "value": "${address}"} }` },
		],
	};

	const extrinsic = await getExtrinsic(network, filter);

	if (!extrinsic) {
		return undefined;
	}

	return addRuntimeSpec(
		network,
		{
			id: address,
			address,
		},
		() => "latest"
	);
}
