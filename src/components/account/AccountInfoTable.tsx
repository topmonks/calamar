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

	return (
		<InfoTable
			data={data}
			loading={loading}
			notFound={notFound}
			notFoundMessage="No account found"
			error={error}
		>
			<InfoTableAttribute
				label="Address"
				render={(data) => data.networkEncodedAddress}
				copyToClipboard={(data) => data.networkEncodedAddress}
			/>
			<InfoTableAttribute
				label="Address (42 prefix)"
				render={(data) => data.networkEncodedAddress42}
				copyToClipboard={(data) => data.networkEncodedAddress42}
			/>
			<InfoTableAttribute
				label="Raw address"
				render={(data) => data.address}
				copyToClipboard={(data) => data.address}
			/>
		</InfoTable>
	);
};
