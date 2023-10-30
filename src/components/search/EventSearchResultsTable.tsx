import { css } from "@emotion/react";

import { Event } from "../../model/event";
import { ItemsResponse } from "../../model/itemsResponse";
import { SearchResultItem } from "../../model/searchResultItem";

import { ButtonLink } from "../ButtonLink";
import { DataViewer } from "../DataViewer";
import { Link } from "../Link";

import { SearchResultsTable, SearchResultsTableItemAttribute, SearchResultsTableProps } from "./SearchResultsTable";
import { PaginatedResource } from "../../model/paginatedResource";

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
					<Link to={`/${event.network.name}/event/${event.id}`}>
						{event.id}
					</Link>
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
				render={(event) => (
					<Link to={`/${event.network.name}/extrinsic/${event.extrinsicId}`}>
						{event.extrinsicId}
					</Link>
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
