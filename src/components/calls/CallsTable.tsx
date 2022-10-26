import { TableBody, TableCell, TableHead, TableRow } from "@mui/material";

import { Pagination } from "../../hooks/usePagination";
import { shortenHash } from "../../utils/shortenHash";

import ItemsTable from "../ItemsTable";
import { Link } from "../Link";

export type CallsTableProps = {
	network: string;
	items: any[];
	pagination: Pagination;
	loading?: boolean;
};

export const CallsTable = (props: CallsTableProps) => {
	const { network, items, pagination, loading } = props;

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

			<TableHead>
				<TableRow>
					<TableCell>Id</TableCell>
					<TableCell>Name</TableCell>
					<TableCell>Sender</TableCell>
					<TableCell>Extrinsic id</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{items.map((item: any) => {
					const call = item.node;
					return (
						<TableRow key={call.id}>
							<TableCell>
								<Link to={`/${network}/call/${call.id}`}>
									{call.id}
								</Link>
							</TableCell>
							<TableCell>{call.name}</TableCell>
							<TableCell>{(call.origin && call.origin.value.__kind !== "None") ? shortenHash(call.origin.value.value) : "None"}</TableCell>
							<TableCell>
								<Link to={`/${network}/extrinsic/${call.extrinsic.id}`}>
									{call.extrinsic.id}
								</Link>
							</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</ItemsTable>
	);
};
