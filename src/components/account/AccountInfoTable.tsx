import { isEthereumAddress } from "@polkadot/util-crypto";

import { useNetwork } from "../../hooks/useNetwork";
import { Resource } from "../../model/resource";
import { encodeAddress } from "../../utils/formatAddress";

import {InfoTable, InfoTableAttribute } from "../InfoTable";

export type ExtrinsicInfoTableProps = {
	network: string;
	account: Resource<any>;
}

export const AccountInfoTable = (props: ExtrinsicInfoTableProps) => {
	const {network, account} = props;

	const networkData = useNetwork(network);

	return (
		<InfoTable
			data={account.data}
			loading={account.loading}
			notFound={account.notFound}
			notFoundMessage="Account doesn't exist or haven't signed any extrinsic"
			error={account.error}
		>
			<InfoTableAttribute
				label={`${networkData?.displayName} address`}
				render={(data) => encodeAddress(network, data.address)}
				copyToClipboard={(data) => encodeAddress(network, data.address)}
				hide={(data) => isEthereumAddress(data.address)}
			/>
			<InfoTableAttribute
				label="Substrate address"
				render={(data) => encodeAddress(network, data.address, 42)}
				copyToClipboard={(data) => encodeAddress(network, data.address, 42)}
				hide={(data) => isEthereumAddress(data.address)}
			/>
			<InfoTableAttribute
				label={(data) => isEthereumAddress(data.address) ? "Address" : "Public key"}
				render={(data) => data.address}
				copyToClipboard={(data) => data.address}
			/>
		</InfoTable>
	);
};
