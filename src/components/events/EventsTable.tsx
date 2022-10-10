import { TableBody, TableCell, TableHead, TableRow } from "@mui/material";

import { Pagination } from "../../hooks/usePagination";
import { shortenHash } from "../../utils/shortenHash";

import ItemsTable from "../ItemsTable";
import { Link } from "../Link";
import ParamsTable from "../ParamsTable";

export type EventsTableProps = {
	network: string;
	items: any[];
	pagination: Pagination;
	showExtrinsic?: boolean;
	loading?: boolean;
};

function EventsTable(props: EventsTableProps) {
	const { network, items, pagination, showExtrinsic, loading } = props;

	return (
		<ItemsTable
			items={items}
			loading={loading}
			noItemsMessage="No events found"
			pagination={pagination}
		>
			<col />
			<col />
			<col width="60%" />
			{showExtrinsic && <col />}
			<TableHead>
				<TableRow>
					<TableCell>Id</TableCell>
					<TableCell>Name</TableCell>
					<TableCell>Parameters</TableCell>
					{showExtrinsic && <TableCell>Extrinsic</TableCell>}
				</TableRow>
			</TableHead>
			<TableBody>
				{items.map((event: any) => (
					<TableRow key={event.id}>
						<TableCell>{event.id}</TableCell>
						<TableCell>{event.name}</TableCell>
						<TableCell>
							<ParamsTable args={event.args} />
						</TableCell>
						{showExtrinsic && event.extrinsic?.hash && (
							<TableCell>
								<Link to={`/${network}/search?query=${event.extrinsic.hash}`}>
									{shortenHash(event.extrinsic.hash)}
								</Link>
							</TableCell>
						)}
					</TableRow>
				))}
			</TableBody>
		</ItemsTable>
	);
}

export default EventsTable;
