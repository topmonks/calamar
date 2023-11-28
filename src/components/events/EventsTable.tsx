/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import { Event } from "../../model/event";
import { Network } from "../../model/network";
import { PaginatedResource } from "../../model/paginatedResource";

import { ExtrinsicLink } from "../extrinsics/ExtrinsicLink";

import { ButtonLink } from "../ButtonLink";
import { DataViewer } from "../DataViewer";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";

import { EventLink } from "./EventLink";

const parametersColCss = (showExtrinsic?: boolean) => css`
	width: ${showExtrinsic ? "40%" : "60%"};
`;

export type EventsTableProps = {
	network: Network;
	events: PaginatedResource<Event>;
	showExtrinsic?: boolean;
	onPageChange?: (page: number) => void;
};

const EventsItemsTableAttribute = ItemsTableAttribute<Event>;

function EventsTable(props: EventsTableProps) {
	const { network, events, showExtrinsic, onPageChange } = props;

	return (
		<ItemsTable
			data={events.data}
			loading={events.loading}
			notFound={events.notFound}
			notFoundMessage="No events found"
			error={events.error}
			pageInfo={events.pageInfo}
			onPageChange={onPageChange}
			data-test="events-items"
		>
			<EventsItemsTableAttribute
				label="ID"
				render={(event) => (
					<EventLink network={network} id={event.id} />
				)}
			/>
			<EventsItemsTableAttribute
				label="Name"
				render={(event) =>
					<ButtonLink
						to={`/${network.name}/search?query=${event.palletName}.${event.eventName}`}
						size="small"
						color="secondary"
					>
						{event.palletName}.{event.eventName}
					</ButtonLink>
				}
			/>
			{showExtrinsic && (
				<EventsItemsTableAttribute
					label="Extrinsic"
					render={(event) => event.extrinsicId && (
						<ExtrinsicLink network={event.network} id={event.extrinsicId} />
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
							metadata={event.metadata.event?.args}
							copyToClipboard
						/>
					);
				}}
			/>
		</ItemsTable>
	);
}

export default EventsTable;
