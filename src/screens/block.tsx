import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { BlockInfoTable } from "../components/blocks/BlockInfoTable";
import { CallsTable } from "../components/calls/CallsTable";
import { Card, CardHeader } from "../components/Card";
import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";
import { TabbedContent, TabPane } from "../components/TabbedContent";
import EventsTable from "../components/events/EventsTable";
import { useBlock } from "../hooks/useBlock";
import { useCalls } from "../hooks/useCalls";
import { useEvents } from "../hooks/useEvents";
import { useExtrinsics } from "../hooks/useExtrinsics";
import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";

type BlockPageParams = {
	network: string;
	id: string;
};

function BlockPage() {
	const { network, id } = useParams() as BlockPageParams;

	const block = useBlock(network, { id_eq: id });

	const extrinsics = useExtrinsics(
		network,
		{ block: { id_eq: id } },
		"id_DESC"
	);

	console.log("EX", extrinsics);

	const events = useEvents(
		network,
		{ block: { id_eq: id } },
		"id_DESC"
	);

	const calls = useCalls(
		network,
		{ block: { id_eq: id } },
		"id_DESC"
	);

	useDOMEventTrigger("data-loaded", !block.loading && !extrinsics.loading && !events.loading && !calls.loading);

	useEffect(() => {
		if (extrinsics.pagination.offset === 0) {
			const interval = setInterval(extrinsics.refetch, 3000);
			return () => clearInterval(interval);
		}
	}, [extrinsics]);

	return (
		<>
			<Card>
				<CardHeader>Block #{id}</CardHeader>
				<BlockInfoTable network={network} {...block} />
			</Card>
			{block.data &&
				<Card>
					<TabbedContent>
						<TabPane
							label="Extrinsics"
							count={extrinsics.pagination.totalCount}
							loading={extrinsics.loading}
							error={extrinsics.error}
							value="extrinsics"
							data-test="extrinsics-tab"
						>
							<ExtrinsicsTable network={network} {...extrinsics} />
						</TabPane>
						<TabPane
							label="Calls"
							count={calls.pagination.totalCount}
							loading={calls.loading}
							error={calls.error}
							value="calls"
							data-test="calls-tab"
						>
							<CallsTable network={network} {...calls} />
						</TabPane>
						<TabPane
							label="Events"
							count={events.pagination.totalCount}
							loading={events.loading}
							error={events.error}
							value="events"
							data-test="events-tab"
						>
							<EventsTable network={network} {...events} />
						</TabPane>
					</TabbedContent>
				</Card>
			}
		</>
	);
}

export default BlockPage;
