import { Data } from "@polkadot/types";
import { isAddress, isEthereumAddress } from "@polkadot/util-crypto";

import { useNetwork } from "../../hooks/useNetwork";
import { Resource } from "../../model/resource";
import { encodeAddress } from "../../utils/formatAddress";

import {InfoTable, InfoTableAttribute } from "../InfoTable";

export type ExtrinsicInfoTableProps = {
	network: string;
	account: Resource<any>;
	address: string;
}

export const AccountInfoTable = (props: ExtrinsicInfoTableProps) => {
	const {network, account, address} = props;

	const networkData = useNetwork(network);

	return (
		<InfoTable
			data={account.data || { }}
			loading={account.loading}
			notFound={account.notFound && !isAddress(address)}
			notFoundMessage="Account doesn't exist or haven't signed any extrinsic"
			error={account.error}
		>
			<InfoTableAttribute
				label={`${networkData?.displayName} address`}
				render={() => encodeAddress(network, address)}
				copyToClipboard={() => encodeAddress(network, address)}
				hide={() => isEthereumAddress(address)}
			/>
			<InfoTableAttribute
				label="Substrate address"
				render={() => encodeAddress(network, address, 42)}
				copyToClipboard={() => encodeAddress(network, address, 42)}
				hide={() => isEthereumAddress(address)}
			/>
			<InfoTableAttribute
				label={() => isEthereumAddress(address) ? "Address" : "Public key"}
				render={() => address}
				copyToClipboard={() => address}
			/>
		</InfoTable>
	);
};
