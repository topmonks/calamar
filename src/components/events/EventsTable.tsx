/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import { Event } from "../../model/event";
import { PaginatedResource } from "../../model/paginatedResource";

import { getEventMetadataByName } from "../../utils/queryMetadata";

import { ButtonLink } from "../ButtonLink";
import DataViewer from "../DataViewer";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";

const parametersColCss = (showExtrinsic?: boolean) => css`
	width: ${showExtrinsic ? "40%" : "60%"};
`;

export type EventsTableProps = {
	network: string;
	events: PaginatedResource<Event>;
	showExtrinsic?: boolean;
};

const EventsItemsTableAttribute = ItemsTableAttribute<Event>;

function EventsTable(props: EventsTableProps) {
	const { network, events, showExtrinsic } = props;

	return (
		<ItemsTable
			data={events.data}
			loading={events.loading}
			notFound={events.notFound}
			notFoundMessage="No events found"
			error={events.error}
			pagination={events.pagination}
			data-test="events-table"
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
				render={(event) =>
					<ButtonLink
						to={`/${network}/search?query=${event.name}`}
						size="small"
						color="secondary"
					>
						{event.name}
					</ButtonLink>
				}
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
			<EventsItemsTableAttribute
				label="Parameters"
				colCss={parametersColCss(showExtrinsic)}
				render={(event) => {
					if (!event.args) {
						return null;
					}

					return (
						<DataViewer
							network={network}
							data={event.args}
							metadata={getEventMetadataByName(event.runtimeSpec.metadata, event.name)?.args}
							runtimeSpec={event.runtimeSpec}
							copyToClipboard
						/>
					);
				}}
			/>
		</ItemsTable>
	);
}

export default EventsTable;
