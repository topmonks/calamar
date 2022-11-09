import { TableBody, TableCell, TableRow } from "@mui/material";

import CopyToClipboardButton from "../CopyToClipboardButton";
import InfoTable from "../InfoTable";
import { Link } from "../Link";
import { Time } from "../Time";

export type BlockInfoTableProps = {
	network: string;
	data: any;
	loading?: boolean;
	notFound?: boolean;
	error?: any;
}

export const BlockInfoTable = (props: BlockInfoTableProps) => {
	const {network, data, loading, notFound, error} = props;

	return (
		<InfoTable
			loading={loading}
			notFound={notFound}
			notFoundMessage="No block found"
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
						<TableCell>Parent hash</TableCell>
						<TableCell>
							<Link to={`/${network}/search?query=${data.parentHash}`}>
								{data.parentHash}
							</Link>
							<CopyToClipboardButton value={data.parentHash} />
						</TableCell>
					</TableRow>
					{data.validator && (
						<TableRow>
							<TableCell>Validator</TableCell>
							<TableCell>
								<Link to={`/${network}/account/${data.validator}`}>
									{data.validator}
								</Link>
								<CopyToClipboardButton value={data.validator} />
							</TableCell>
						</TableRow>
					)}
					<TableRow>
						<TableCell>Block height</TableCell>
						<TableCell>{data.height}</TableCell>
					</TableRow>
					{data.height !== 0 && <TableRow>
						<TableCell>Date</TableCell>
						<TableCell>
							<Time time={data.timestamp} fromNow />
						</TableCell>
					</TableRow>
					}
				</TableBody>
			)}
		</InfoTable>

	);
};
