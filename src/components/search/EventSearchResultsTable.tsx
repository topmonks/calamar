import { css } from "@emotion/react";

import { Event } from "../../model/event";
import { ItemsResponse } from "../../model/itemsResponse";
import { SearchResultItem } from "../../model/searchResultItem";

import { ButtonLink } from "../ButtonLink";
import { DataViewer } from "../DataViewer";
import { Link } from "../Link";

import { SearchResultsTable, SearchResultsTableItemAttribute } from "./SearchResultsTable";

const eventArgsColCss = css`
	width: 35%;
`;

export interface EventSearchResultsTable {
	query: string;
	items: ItemsResponse<SearchResultItem<Event>, true>;
	onPageChange?: (page: number) => void;
}

export const EventSearchResultsTable = (props: EventSearchResultsTable) => {
	const {query, items, onPageChange} = props;

	return (
		<SearchResultsTable<Event>
			query={query}
			items={items}
			itemsPlural="events"
			onPageChange={onPageChange}
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
