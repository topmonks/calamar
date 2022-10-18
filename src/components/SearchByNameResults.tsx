/** @jsxImportSource @emotion/react */
import { ReactElement } from "react";
import { CircularProgress, Tab } from "@mui/material";

import { useEvents } from "../hooks/useEvents";
import { useExtrinsics } from "../hooks/useExtrinsics";

import { Card, CardHeader } from "./Card";
import EventsTable from "./events/EventsTable";
import ExtrinsicsTable from "./extrinsics/ExtrinsicsTable";
import { Tabs, tabStyle } from "./tabs";

type SearchByNameResultsProps = {
	network: string;
	name: string;
	extrinsics: ReturnType<typeof useExtrinsics>;
	events: ReturnType<typeof useEvents>;
};

function SearchByNameResults(props: SearchByNameResultsProps) {
	const { network, name, extrinsics, events } = props;

	const tabHandles: ReactElement[] = [];
	const tabPanes: ReactElement[] = [];

	if (extrinsics.loading || extrinsics.items.length > 0) {
		tabHandles.push(
			<Tab
				key="extrinsics"
				css={tabStyle}
				label={
					<>
						<span>Extrinsics</span>
						{extrinsics.loading && <CircularProgress size={14} />}
					</>
				}
				value="extrinsics"
			/>
		);

		tabPanes.push(
			<ExtrinsicsTable
				items={extrinsics.items}
				key="extrinsics"
				loading={extrinsics.loading}
				network={network}
				pagination={extrinsics.pagination}
			/>
		);
	}

	if (events.loading || events.items.length > 0) {
		tabHandles.push(
			<Tab
				key="events"
				css={tabStyle}
				label={
					<>
						<span>Events</span>
						{events.loading && <CircularProgress size={14} />}
					</>
				}
				value="events"
			/>
		);

		tabPanes.push(
			<EventsTable
				items={events.items}
				key="events"
				loading={events.loading}
				network={network}
				pagination={events.pagination}
				showExtrinsic
			/>
		);
	}

	return (
		<Card>
			<CardHeader>
				Results for name <span style={{ fontWeight: "normal" }}>{name}</span>
			</CardHeader>
			<Tabs
				tabHandles={tabHandles}
				tabPanes={tabPanes} />
		</Card>
	);
}

export default SearchByNameResults;
