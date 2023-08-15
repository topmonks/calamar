import { isAddress } from "@polkadot/util-crypto";

import { Account } from "../model/account";
import { MainSquidIdentity } from "../model/main-squid/mainSquidIdentity";
import { addRuntimeSpec } from "../utils/addRuntimeSpec";
import { DataError } from "../utils/error";
import { decodeAddress, encodeAddress } from "../utils/formatAddress";

import { getNetwork, hasSupport } from "./networksService";
import { fetchIdentitiesSquid } from "./fetchService";
import { AccountIdentity } from "../model/accountIdentity";

export async function getAccount(network: string, address: string): Promise<Account|undefined> {
	if (!isAddress(address)) {
		throw new DataError("Invalid account address");
	}

	// if the address is encoded, decode it
	const decodedAddress = decodeAddress(address);

	if (decodedAddress) {
		address = decodedAddress;
	}

	const data: Omit<Account, "runtimeSpec"> = {
		id: address,
		address,
		identity: null
	};

	if (hasSupport(network, "identities-squid")) {
		data.identity = await getAccountIdentity(network, address);
	}

	const account = await addRuntimeSpec(network, data, () => "latest");

	return account;
}

/*** PRIVATE ***/

async function getAccountIdentity(networkName: string, address: string) {
	const network = getNetwork(networkName);

	const response = await fetchIdentitiesSquid<{identity: MainSquidIdentity|null}>(
		networkName,
		`query ($id: String!) {
			identity: identityById(id: $id) {
				id
				display
				legal
				web
				email
				twitter
				riot
			}
		}`,
		{
			id: encodeAddress(address, network.prefix)
		}
	);

	return response.identity && unifyMainSquidIdentity(response.identity);
}

function unifyMainSquidIdentity(identity: MainSquidIdentity): AccountIdentity {
	return identity;
}
