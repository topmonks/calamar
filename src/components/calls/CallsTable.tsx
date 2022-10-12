import { TableBody, TableCell, TableHead, TableRow, Tooltip } from "@mui/material";

import { Pagination } from "../../hooks/usePagination";
import { convertTimestampToTimeFromNow, formatDate } from "../../utils/convertTimestampToTimeFromNow";
import { shortenHash } from "../../utils/shortenHash";

import ItemsTable from "../ItemsTable";
import { Link } from "../Link";
import ParamsTable from "../ParamsTable";

export type CallsTableProps = {
	network: string;
	items: any[];
	pagination: Pagination;
	showCalls?: boolean;
	loading?: boolean;
};

export const CallsTable = (props: CallsTableProps) => {
	const { network, items, pagination, showCalls, loading } = props;

	return (
		<ItemsTable
			items={items}
			loading={loading}
			noItemsMessage="No calls found"
			pagination={pagination}
		>
			<col />
			<col />
			<col />
			<col />
			<col width="30%" />
			<col />
			<col />

			<TableHead>
				<TableRow>
					<TableCell>Id</TableCell>
					<TableCell>Name</TableCell>
					<TableCell>Timestamp</TableCell>
					<TableCell>Sender</TableCell>
					<TableCell>Parameters</TableCell>
					<TableCell>Block height</TableCell>
					<TableCell>Extrinsic id</TableCell>


					{showCalls && <TableCell>Calls</TableCell>}
				</TableRow>
			</TableHead>
			<TableBody>
				{items.map((call: any) => (
					<TableRow key={call.id}>
						<TableCell>
							<Link to={`/${network}/call/${call.id}`}>
								{call.id}
							</Link>
						</TableCell>
						<TableCell>{call.name}</TableCell>
						<TableCell>
							<Tooltip
								arrow
								placement="top"
								title={formatDate(call.block.timestamp)}
							>
								<span>
									{convertTimestampToTimeFromNow(call.block.timestamp)}
								</span>
							</Tooltip>
						</TableCell>
						<TableCell>{call.origin.value.__kind === "None" ? "None" : call.origin.value.value}</TableCell>
						<TableCell>
							<ParamsTable args={call.args} />
						</TableCell>

						<TableCell>
							<Link to={`/${network}/block/${call.block.id}`}>
								{call.block.height}
							</Link>
						</TableCell>
						<TableCell>
							<Link to={`/${network}/extrinsic/${call.extrinsic.id}`}>
								{call.extrinsic.id}
							</Link>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</ItemsTable>
	);
};
