import { TableBody, TableCell, TableRow } from "@mui/material";

import CopyToClipboardButton from "../CopyToClipboardButton";
import InfoTable from "../InfoTable";
import { Link } from "../Link";
import { Time } from "../Time";
import ParamsTable from "../ParamsTable";

export type EventInfoTableProps = {
	network: string;
	data: any;
	loading?: boolean;
	notFound?: boolean;
	error?: any;
}

export const EventInfoTable = (props: EventInfoTableProps) => {
	const {network, data, loading, notFound, error} = props;

	return (
		<InfoTable
			loading={loading}
			notFound={notFound}
			notFoundMessage="No event found"
			error={error}
		>
			{data && (
				<TableBody>
					<TableRow>
						<TableCell>Id</TableCell>
						<TableCell>{data.id}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Name</TableCell>
						<TableCell>{data.name}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Block time</TableCell>
						<TableCell>
							<Time time={data.block.timestamp} fromNow />
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Parameters</TableCell>
						<TableCell>
							<ParamsTable args={data.args} />
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Spec version</TableCell>
						<TableCell>
							{data.block.spec.specVersion}
						</TableCell>
					</TableRow>
					{data.call && <TableRow>
						<TableCell>Call id</TableCell>
						<TableCell>
							<Link
								to={`/${network}/call/${data.call.id}`}
							>
								{data.call.id}
							</Link>
							<CopyToClipboardButton
								value={data.call.id}
							/>
						</TableCell>
					</TableRow>}
					<TableRow>
						<TableCell>Extrinsic id</TableCell>
						<TableCell>
							<Link
								to={`/${network}/extrinsic/${data.extrinsic.id}`}
							>
								{data.extrinsic.id}
							</Link>
							<CopyToClipboardButton
								value={data.extrinsic.id}
							/>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Block height</TableCell>
						<TableCell>
							<Link
								to={`/${network}/block/${data.block.id}`}
							>
								{data.block.height}
							</Link>
							<CopyToClipboardButton
								value={data.block.height}
							/>
						</TableCell>
					</TableRow>
				</TableBody>
			)}
		</InfoTable>
	);
};
