import ss58Registry from "../ss58-registry.json";
import Keyring from "@polkadot/keyring";
import arrayBufferToHex from "array-buffer-to-hex";
import { isAddress } from "@polkadot/util-crypto";
import { useParams } from "react-router-dom";
import { useAccount } from "../hooks/useAccount";
import { useBlock } from "../hooks/useBlock";
import { useExtrinsic } from "../hooks/useExtrinsic";
import { useEventsWithoutTotalCount } from "../hooks/useEventsWithoutTotalCount";
import { useContext } from "react";
import { AccountArrayContext } from "../hooks/useAccountsArrayContext";

const getPrefix = (network: string) => {
	return ss58Registry.registry.find((r) => r.network === network)?.prefix;
};

type SearchPageParams = {
	network: string;
};

export function isPublicKey(address: any) {

	if (typeof address === "string" && address.length === 66 && isAddress(address)) {

		// This part was inspired by search.tsx
		const { network } = useParams() as SearchPageParams;

		const tryExtrinsic = useExtrinsic(network, { hash_eq: address } );
		if (tryExtrinsic.data) return false;
		const tryBlock = useBlock(network, { hash_eq: address });
		if (tryBlock.data) return false;
		return true;
	}
	return false;
}

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
