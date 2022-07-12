import { getArchive } from "./fetchGraphql";
import ss58Registry from "../ss58-registry.json";
import Keyring from "@polkadot/keyring";
import arrayBufferToHex from "array-buffer-to-hex";

const getPrefix = () => {
  const archive = getArchive();
  return ss58Registry.registry.find((r) => r.network === archive.network)
    ?.prefix;
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

export function encodeAddress(address: string, prefix = getPrefix()) {
  if (prefix !== undefined) {
    try {
      const keyring = new Keyring();
      return keyring.encodeAddress(address, prefix);
    } catch (e) {
      console.log(e);
    }
  }
}
