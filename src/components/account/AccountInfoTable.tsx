import { TableBody, TableCell, TableRow } from "@mui/material";

import CopyToClipboardButton from "../CopyToClipboardButton";
import InfoTable from "../InfoTable";

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
			loading={loading}
			notFound={notFound}
			notFoundMessage="No account found"
			error={error}
		>
			{data &&
				<TableBody>
					<TableRow>
						<TableCell>Address</TableCell>
						<TableCell>
							{data.networkEncodedAddress}
							<span style={{ marginLeft: 8 }}>
								<CopyToClipboardButton value={data.networkEncodedAddress} />
							</span>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Address (42 prefix)</TableCell>
						<TableCell>
							{data.networkEncodedAddress42}
							<span style={{ marginLeft: 8 }}>
								<CopyToClipboardButton value={data.networkEncodedAddress42} />
							</span>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Raw address</TableCell>
						<TableCell>
							{data.address}
							<span style={{ marginLeft: 8 }}>
								<CopyToClipboardButton value={data.address} />
							</span>
						</TableCell>
					</TableRow>
				</TableBody>
			}
		</InfoTable>
	);
};
