/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import { Pagination } from "../../hooks/usePagination";

import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";
import ParamsTable from "../ParamsTable";

const tableStyle = (showExtrinsic?: boolean) => css`
	col[data-name=parameters] {
		width: ${showExtrinsic ? "40%" : "60%"};
	}
`;

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
			items={items}
			loading={loading}
			notFound={notFound}
			notFoundMessage="No events found"
			error={error}
			pagination={pagination}
			data-test="events-table"
			css={tableStyle(showExtrinsic)}
		>
			<ItemsTableAttribute
				label="ID"
				render={(event) => (
					<Link to={`/${network}/event/${event.id}`}>
						{event.id}
					</Link>
				)}
			/>
			<ItemsTableAttribute
				label="Name"
				render={(event) => event.name}
			/>
			{showExtrinsic && (
				<ItemsTableAttribute
					label="Extrinsic"
					render={(event) => event.extrinsic?.id && (
						<Link to={`/${network}/extrinsic/${event.extrinsic.id}`}>
							{event.extrinsic.id}
						</Link>
					)}
				/>
			)}
			<ItemsTableAttribute
				name="parameters"
				label="Parameters"
				render={(event) => <ParamsTable args={event.args} />}
			/>
		</ItemsTable>
	);
}

export default EventsTable;
