import ss58Registry from "@substrate/ss58-registry";
import Keyring from "@polkadot/keyring";
import { ethereumEncode } from "@polkadot/util-crypto";
import { hexToU8a, isHex, u8aToHex } from "@polkadot/util";

const getPrefix = (network: string) => {
	return ss58Registry.find((r) => r.network === network)?.prefix;
};

export function decodeAddress(address: string) {
	try {
		const keyring = new Keyring();
		address = u8aToHex(keyring.decodeAddress(address));
	} catch (e) {
		console.warn(e);
	}

	return address;
}

export function encodeAddress(
	network: string,
	address: string,
	prefix?: number
) {
	prefix = prefix || getPrefix(network);

	if (Number.isInteger(prefix)) {
		try {
			const keyring = new Keyring();

			const u8a = isHex(address)
				? hexToU8a(address)
				: keyring.decodeAddress(address);

			if (u8a.length === 20) {
				address = ethereumEncode(u8a);
			} else {
				address = keyring.encodeAddress(u8a, prefix);
			}
		} catch (e) {
			console.warn(e);
		}
	}

	return address;
}
