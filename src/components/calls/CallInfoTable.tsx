import { TableBody, TableCell, TableRow } from "@mui/material";

import CrossIcon from "../../assets/cross-icon.png";
import CheckIcon from "../../assets/check-icon.png";

import { shortenHash } from "../../utils/shortenHash";
import { shortenId } from "../../utils/shortenId";

import CopyToClipboardButton from "../CopyToClipboardButton";
import InfoTable from "../InfoTable";
import { Link } from "../Link";
import { Time } from "../Time";
import ParamsTable from "../ParamsTable";

export type CallInfoTableProps = {
	network: string;
	data: any;
	loading?: boolean;
	notFound?: boolean;
	error?: any;
}

export const CallInfoTable = (props: CallInfoTableProps) => {
	const {network, data, loading, notFound, error} = props;

	return (
		<InfoTable
			loading={loading}
			notFound={notFound}
			notFoundMessage="No call found"
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
						<TableCell>Success</TableCell>
						<TableCell>
							<img src={data.success ? CheckIcon : CrossIcon} />
						</TableCell>
					</TableRow>
					{data.args && (
						<TableRow>
							<TableCell>Parameters</TableCell>
							<TableCell>
								<ParamsTable args={data.args} />
							</TableCell>
						</TableRow>
					)}
					<TableRow>
						<TableCell>Spec version</TableCell>
						<TableCell>{data.block.spec.specVersion}</TableCell>
					</TableRow>

					<TableRow>
						<TableCell>Sender</TableCell>
						<TableCell>{(data.origin && data.origin.value.__kind !== "None") ? shortenHash(data.origin.value.value) : "None"}</TableCell>
					</TableRow>
					{data.parrent && <TableRow>
						<TableCell>Parent</TableCell>
						<TableCell>
							<Link to={`/${network}/call/${data.parent.id}`}>
								{shortenId(data.parent.id)}
							</Link>
							<CopyToClipboardButton value={data.parent.id} />
						</TableCell>
					</TableRow>}
					<TableRow>
						<TableCell>Extrinsic id</TableCell>
						<TableCell>
							<Link to={`/${network}/extrinsic/${data.extrinsic.id}`}>
								{shortenId(data.extrinsic.id)}
							</Link>
							<CopyToClipboardButton value={data.extrinsic.id} />
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Block height</TableCell>
						<TableCell>
							<Link to={`/${network}/block/${data.block.id}`}>
								{data.block.height}
							</Link>
							<CopyToClipboardButton value={data.block.height} />
						</TableCell>
					</TableRow>
				</TableBody>
			)}
		</InfoTable>
	);
};
