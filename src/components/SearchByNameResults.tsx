/** @jsxImportSource @emotion/react */
import { ReactElement, useEffect, useState } from "react";
import { CircularProgress, Tab, Tabs } from "@mui/material";

import { useEvents } from "../hooks/useEvents";
import { useExtrinsics } from "../hooks/useExtrinsics";

import { Card, CardHeader } from "./Card";
import EventsTable from "./events/EventsTable";
import ExtrinsicsTable from "./extrinsics/ExtrinsicsTable";
import { tabsStyle, tabStyle, tabsWrapperStyle } from "../styled/tabs";

type SearchByNameResultsProps = {
	network: string;
	name: string;
	extrinsics: ReturnType<typeof useExtrinsics>;
	events: ReturnType<typeof useEvents>;
};

function SearchByNameResults(props: SearchByNameResultsProps) {
	const { network, name, extrinsics, events } = props;

	const [tab, setTab] = useState<string | undefined>(undefined);

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

	useEffect(() => {
		if (extrinsics.items.length > 0) {
			setTab("extrinsics");
		} else if (events.items.length > 0) {
			setTab("events");
		}
	}, [extrinsics, events]);

	return (
		<Card>
			<CardHeader>
				Results for name <span style={{ fontWeight: "normal" }}>{name}</span>
			</CardHeader>
			<div css={tabsWrapperStyle}>
				<Tabs
					css={tabsStyle}
					onChange={(event, tab) => setTab(tab)}
					value={tab || tabHandles[0]!.props.value}
				>
					{tabHandles}
				</Tabs>
			</div>
			{tab ? tabPanes.find((it) => it.key === tab) : tabPanes[0]}
		</Card>
	);
}

export default SearchByNameResults;
