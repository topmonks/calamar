import ss58Registry from "../ss58-registry.json";
import Keyring from "@polkadot/keyring";
import arrayBufferToHex from "array-buffer-to-hex";

const getPrefix = (network: string) => {
	return ss58Registry.registry.find((r) => r.network === network)?.prefix;
};

export function decodeAddress(address: string) {
	try {
		const keyring = new Keyring();
		const decodedAccountAddressArray = keyring.decodeAddress(address);
		return "0x" + arrayBufferToHex(decodedAccountAddressArray);
	} catch (e) {
		console.log(e);
	}
}

export function encodeAddress(
	network: string,
	address: string,
	prefix?: number
) {
	prefix = prefix || getPrefix(network);

	if (prefix !== undefined) {
		try {
			const keyring = new Keyring();
			return keyring.encodeAddress(address, prefix);
		} catch (e) {
			console.log(e);
		}
	}
}
