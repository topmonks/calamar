import { isEthereumAddress } from "@polkadot/util-crypto";

import { useNetwork } from "../../hooks/useNetwork";
import { encodeAddress } from "../../utils/formatAddress";

import {InfoTable, InfoTableAttribute } from "../InfoTable";

export type ExtrinsicInfoTableProps = {
	network: string;
	data: any;
	loading?: boolean;
	notFound?: boolean;
	error?: any;
}

export const AccountInfoTable = (props: ExtrinsicInfoTableProps) => {
	const {network, data, loading, notFound, error} = props;

	const networkData = useNetwork(network);

	return (
		<InfoTable
			data={data}
			loading={loading}
			notFound={notFound}
			notFoundMessage="No account found"
			error={error}
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
