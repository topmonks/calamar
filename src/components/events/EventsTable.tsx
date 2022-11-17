import { TableBody, TableCell, TableHead, TableRow } from "@mui/material";

import { Pagination } from "../../hooks/usePagination";
import { shortenId } from "../../utils/shortenId";

import ItemsTable from "../ItemsTable";
import { Link } from "../Link";
import ParamsTable from "../ParamsTable";

export type EventsTableProps = {
	network: string;
	items: any[];
	pagination: Pagination;
	showExtrinsic?: boolean;
	loading?: boolean;
	notFound?: boolean;
	error?: any;
};

function EventsTable(props: EventsTableProps) {
	const { network, items, pagination, showExtrinsic, loading, notFound, error } = props;

	return (
		<ItemsTable
			loading={loading}
			notFound={notFound}
			notFoundMessage="No events found"
			error={error}
			pagination={pagination}
			data-test="events-table"
		>
			<col />
			<col />
			<col width={showExtrinsic ? "40%" : "60%" } />
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
						<TableCell>
							<Link to={`/${network}/event/${event.id}`}>
								{shortenId(event.id)}
							</Link>
						</TableCell>
						<TableCell>{event.name}</TableCell>
						<TableCell>
							<ParamsTable args={event.args} />
						</TableCell>
						{showExtrinsic &&
							<TableCell>
								{event.extrinsic?.id &&
									<Link to={`/${network}/extrinsic/${event.extrinsic.id}`}>
										{shortenId(event.extrinsic.id)}
									</Link>
								}
							</TableCell>
						}
					</TableRow>
				))}
			</TableBody>
		</ItemsTable>
	);
}

export default EventsTable;
