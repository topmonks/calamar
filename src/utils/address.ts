import Keyring from "@polkadot/keyring";
import { ethereumEncode, isAddress } from "@polkadot/util-crypto";
import { hexToU8a, isHex, u8aToHex } from "@polkadot/util";

import { Network } from "../model/network";

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
	address: string,
	prefix: number
) {
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

	return address;
}

export function isEncodedAddress(network: Network, str: string) {
	return isAddress(str) && str === encodeAddress(str, network.prefix);
}

export function isAccountPublicKey(str: string) {
	return isHex(str) && isAddress(str);
}
