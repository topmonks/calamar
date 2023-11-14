import { css } from "@emotion/react";

import { Event } from "../../model/event";
import { SearchResultItem } from "../../model/searchResultItem";
import { PaginatedResource } from "../../model/paginatedResource";

import { ExtrinsicLink } from "../extrinsics/ExtrinsicLink";
import { EventLink } from "../events/EventLink";

import { ButtonLink } from "../ButtonLink";
import { DataViewer } from "../DataViewer";

import { SearchResultsTable, SearchResultsTableItemAttribute, SearchResultsTableProps } from "./SearchResultsTable";

const eventArgsColCss = css`
	width: 35%;
`;

export interface EventSearchResultsTable
	extends Pick<SearchResultsTableProps<Event>, "query" | "onPageChange"> {
	events: PaginatedResource<SearchResultItem<Event>>;
}

export const EventSearchResultsTable = (props: EventSearchResultsTable) => {
	const {events, ...tableProps} = props;

	return (
		<SearchResultsTable<Event>
			data={events.data}
			loading={events.loading}
			pageInfo={events.pageInfo}
			notFound={events.notFound}
			error={events.error}
			itemsPlural="events"
			{...tableProps}
		>
			<SearchResultsTableItemAttribute<Event>
				label="Event (ID)"
				render={(event) => (
					<EventLink network={event.network} id={event.id} />
				)}
			/>
			<SearchResultsTableItemAttribute<Event>
				label="Name"
				render={(event) => (
					<ButtonLink
						to={`/${event.network.name}/search?query=${event.palletName}.${event.eventName}`}
						size="small"
						color="secondary"
					>
						{event.palletName}.{event.eventName}
					</ButtonLink>
				)}
			/>
			<SearchResultsTableItemAttribute<Event>
				label="Extrinsic"
				render={(event) => event.extrinsicId && (
					<ExtrinsicLink network={event.network} id={event.extrinsicId} />
				)}
			/>
			<SearchResultsTableItemAttribute<Event>
				label="Parameters"
				colCss={eventArgsColCss}
				render={(event) => {
					if (!event.args) {
						return null;
					}

					return (
						<DataViewer
							network={event.network}
							data={event.args}
							metadata={event.metadata.event?.args}
							copyToClipboard
						/>
					);
				}}
			/>
		</SearchResultsTable>
	);
};
