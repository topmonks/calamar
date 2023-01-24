import { isAddress } from "@polkadot/util-crypto";
import { decodeAddress } from "../utils/formatAddress";

export async function getAccount(network: string, address: string) {
	if (!isAddress(address)) {
		return null;
	}

	// if the address is encoded, decode it
	const decodedAddress = decodeAddress(address);

	if (decodedAddress) {
		address = decodedAddress;
	}

	return { address: address, id: address };
}
