import { isAddress } from "@polkadot/util-crypto";

import { Account } from "../model/account";
import { AccountIdentity } from "../model/accountIdentity";
import { MainSquidIdentity } from "../model/main-squid/mainSquidIdentity";
import { DataError } from "../utils/error";
import { decodeAddress, encodeAddress } from "../utils/address";

import { getNetwork, hasSupport } from "./networksService";
import { fetchIdentitiesSquid } from "./fetchService";

export async function getAccount(network: string, address: string): Promise<Account|undefined> {
	if (!isAddress(address)) {
		throw new DataError("Invalid account address");
	}

	// if the address is encoded, decode it
	const decodedAddress = decodeAddress(address);

	if (decodedAddress) {
		address = decodedAddress;
	}

	const account: Account = {
		id: address,
		network: getNetwork(network),
		address,
		identity: null
	};

	if (hasSupport(network, "identities-squid")) {
		account.identity = await getAccountIdentity(network, address);
	}

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
