import { TableBody, TableCell, TableRow } from "@mui/material";

import CrossIcon from "../../assets/cross-icon.png";
import CheckIcon from "../../assets/check-icon.png";

import { encodeAddress } from "../../utils/formatAddress";

import CopyToClipboardButton from "../CopyToClipboardButton";
import InfoTable from "../InfoTable";
import { Link } from "../Link";
import { Time } from "../Time";
import ParamsTable from "../ParamsTable";

export type ExtrinsicInfoTableProps = {
	network: string;
	data: any;
	loading?: boolean;
	notFound?: boolean;
	error?: any;
}

export const ExtrinsicInfoTable = (props: ExtrinsicInfoTableProps) => {
	const {network, data, loading, notFound, error} = props;

	return (
		<InfoTable
			loading={loading}
			notFound={notFound}
			notFoundMessage="No extrinsic found"
			error={error}
		>
			{data && (
				<TableBody>
					<TableRow>
						<TableCell>Id</TableCell>
						<TableCell>{data.id}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Hash</TableCell>
						<TableCell>
							{data.hash}
							<CopyToClipboardButton value={data.hash} />
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Block time</TableCell>
						<TableCell>
							<Time time={data.block.timestamp} fromNow />
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Block hash</TableCell>
						<TableCell>
							<Link to={`/${network}/block/${data.block.id}`}>
								{data.block.hash}
							</Link>
							<CopyToClipboardButton value={data.block.hash} />
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Name</TableCell>
						<TableCell>{data.call.name}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Is signed</TableCell>
						<TableCell>
							<img src={data.signature ? CheckIcon : CrossIcon} />
						</TableCell>
					</TableRow>
					{data.signature?.address && (
						<TableRow>
							<TableCell>Account</TableCell>
							<TableCell>
								<Link
									to={`/${network}/account/${data.signature.address}`}
								>
									{encodeAddress(network, data.signature?.address) ||
										data.signature?.address}
								</Link>
								<CopyToClipboardButton
									value={
										encodeAddress(
											network,
											data.signature?.address
										) || data.signature?.address
									}
								/>
							</TableCell>
						</TableRow>
					)}
					<TableRow>
						<TableCell>Index in block</TableCell>
						<TableCell>{data.indexInBlock}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Success</TableCell>
						<TableCell>
							<img src={data.success ? CheckIcon : CrossIcon} />
						</TableCell>
					</TableRow>
					{data.tip !== null && (
						<TableRow>
							<TableCell>Tip</TableCell>
							<TableCell>{data.tip}</TableCell>
						</TableRow>
					)}
					{data.fee !== null && (
						<TableRow>
							<TableCell>Fee</TableCell>
							<TableCell>{data.fee}</TableCell>
						</TableRow>
					)}
					{data.error !== null && (
						<TableRow>
							<TableCell>Error</TableCell>
							<TableCell>{JSON.stringify(data.error)}</TableCell>
						</TableRow>
					)}
					<TableRow>
						<TableCell>Version</TableCell>
						<TableCell>{data.version}</TableCell>
					</TableRow>
					{data.call.args && (
						<TableRow>
							<TableCell>Parameters</TableCell>
							<TableCell>
								<ParamsTable args={data.call.args} />
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			)}
		</InfoTable>
	);
};
