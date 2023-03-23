import { isEthereumAddress } from "@polkadot/util-crypto";

import { useNetwork } from "../../hooks/useNetwork";
import { Account } from "../../model/account";
import { Resource } from "../../model/resource";
import { encodeAddress } from "../../utils/formatAddress";

import {InfoTable, InfoTableAttribute } from "../InfoTable";

export type ExtrinsicInfoTableProps = {
	network: string;
	account: Resource<Account>;
}

const AccountInfoTableAttribute = InfoTableAttribute<Account>;

export const AccountInfoTable = (props: ExtrinsicInfoTableProps) => {
	const {network, account} = props;

	const networkData = useNetwork(network);

	return (
		<InfoTable
			data={account.data}
			loading={account.loading}
			notFound={account.notFound}
			notFoundMessage="Account doesn't exist"
			error={account.error}
		>
			<AccountInfoTableAttribute
				label={`${networkData?.displayName} address`}
				render={(data) => encodeAddress(data.address, data.runtimeSpec.metadata.ss58Prefix)}
				copyToClipboard={(data) => encodeAddress(data.address, data.runtimeSpec.metadata.ss58Prefix)}
				hide={(data) => isEthereumAddress(data.address)}
			/>
			<AccountInfoTableAttribute
				label="Substrate address"
				render={(data) => encodeAddress(data.address, 42)}
				copyToClipboard={(data) => encodeAddress(data.address, 42)}
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
