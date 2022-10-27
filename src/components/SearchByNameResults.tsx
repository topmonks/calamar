/** @jsxImportSource @emotion/react */
import { CircularProgress } from "@mui/material";

import { useEvents } from "../hooks/useEvents";
import { useExtrinsics } from "../hooks/useExtrinsics";

import EventsTable from "./events/EventsTable";
import ExtrinsicsTable from "./extrinsics/ExtrinsicsTable";

import { Card, CardHeader } from "./Card";
import { TabbedContent, TabPane } from "./TabbedContent";

type SearchByNameResultsProps = {
	network: string;
	name: string;
	extrinsics: ReturnType<typeof useExtrinsics>;
	events: ReturnType<typeof useEvents>;
};

function SearchByNameResults(props: SearchByNameResultsProps) {
	const { network, name, extrinsics, events } = props;

	return (
		<Card>
			<CardHeader>
				Results for name <span style={{ fontWeight: "normal" }}>{name}</span>
			</CardHeader>
			<TabbedContent>
				{(extrinsics.loading || extrinsics.items.length > 0) &&
					<TabPane
						label={
							<>
								{extrinsics.pagination.totalCount ?
									<span>Extrinsics ({extrinsics.pagination.totalCount})</span> :
									<span>Extrinsics</span>
								}
								{extrinsics.loading && <CircularProgress size={14} />}
							</>
						}
						value="extrinsics"
					>
						<ExtrinsicsTable
							items={extrinsics.items}
							loading={extrinsics.loading}
							network={network}
							pagination={extrinsics.pagination}
						/>
					</TabPane>
				}
				{(events.loading || events.items.length > 0) &&
					<TabPane
						label={
							<>
								<span>Events ({events.pagination.totalCount})</span>
								{events.loading && <CircularProgress size={14} />}
							</>
						}
						value="events"
					>
						<EventsTable
							items={events.items}
							loading={events.loading}
							network={network}
							pagination={events.pagination}
							showExtrinsic
						/>
					</TabPane>
				}
			</TabbedContent>
		</Card>
	);
}

export default SearchByNameResults;
