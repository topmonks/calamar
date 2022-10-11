/** @jsxImportSource @emotion/react */
import { ReactElement, useEffect, useState } from "react";
import { CircularProgress, Tab, Tabs } from "@mui/material";
import { Theme, css } from "@emotion/react";

import { useEvents } from "../hooks/useEvents";
import { useExtrinsics } from "../hooks/useExtrinsics";

import { Card, CardHeader } from "./Card";
import EventsTable from "./events/EventsTable";
import ExtrinsicsTable from "./extrinsics/ExtrinsicsTable";

const tabsWrapperStyle = css`
	margin-top: -16px;
	margin-bottom: 16px;
	border-bottom: solid 1px rgba(0, 0, 0, 0.12);
`;

const tabsStyle = (theme: Theme) => css`
	margin-bottom: -1px;

	.MuiTabs-indicator {
		height: 3px;
		background-color: ${theme.palette.secondary.main};
	}
`;

const tabStyle = (theme: Theme) => css`
	display: flex;
	flex-direction: row;
	align-items: center;

	&.Mui-selected {
		color: ${theme.palette.secondary.main};
		font-weight: 700;
		background-color: #f5f5f5;

		.MuiCircularProgress-root {
			color: #${theme.palette.secondary.main};
		}
	}

	.MuiCircularProgress-root {
		color: rgba(0, 0, 0, 0.6);
		margin-left: 8px;
	}
`;

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
