import { isAddress } from "@polkadot/util-crypto";
import { decodeAddress } from "../utils/formatAddress";

import { getExtrinsic } from "./extrinsicsService";

export async function getAccount(network: string, address: string) {
	if (!isAddress(address)) {
		return null;
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
		return { address: address };
	}

	return {
		id: address,
		address
	};
}
