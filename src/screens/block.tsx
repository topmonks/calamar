import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { CircularProgress, TableBody, TableCell, TableRow } from "@mui/material";
import { Card, CardHeader } from "../components/Card";
import CopyToClipboardButton from "../components/CopyToClipboardButton";
import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";
import InfoTable from "../components/InfoTable";
import { Link } from "../components/Link";
import { useBlock } from "../hooks/useBlock";
import { TabbedContent, TabPane } from "../components/TabbedContent";
import { useExtrinsics } from "../hooks/useExtrinsics";
import { Time } from "../components/Time";
import { useEvents } from "../hooks/useEvents";
import { useCalls } from "../hooks/useCalls";
import { CallsTable } from "../components/calls/CallsTable";
import EventsTable from "../components/events/EventsTable";

type BlockPageParams = {
	network: string;
	id: string;
};

function BlockPage() {
	const { network, id } = useParams() as BlockPageParams;

	const [block, { loading }] = useBlock(network, { id_eq: id });

	const extrinsics = useExtrinsics(
		network,
		{ block: { id_eq: id } },
		"id_DESC"
	);

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
				<InfoTable
					item={block}
					loading={loading}
					noItemMessage="No block found"
				>
					{block && (
						<TableBody>
							<TableRow>
								<TableCell>Id</TableCell>
								<TableCell>{block.id}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Hash</TableCell>
								<TableCell>
									{block.hash}
									<CopyToClipboardButton value={block.hash} />
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Parent hash</TableCell>
								<TableCell>
									<Link to={`/${network}/search?query=${block.parentHash}`}>
										{block.parentHash}
									</Link>
									<CopyToClipboardButton value={block.parentHash} />
								</TableCell>
							</TableRow>
							{block.validator && (
								<TableRow>
									<TableCell>Validator</TableCell>
									<TableCell>
										<Link to={`/${network}/account/${block.validator}`}>
											{block.validator}
										</Link>
										<CopyToClipboardButton value={block.validator} />
									</TableCell>
								</TableRow>
							)}
							<TableRow>
								<TableCell>Block height</TableCell>
								<TableCell>{block.height}</TableCell>
							</TableRow>
							{block.height !== 0 && <TableRow>
								<TableCell>Date</TableCell>
								<TableCell>
									<Time time={block.timestamp} fromNow />
								</TableCell>
							</TableRow>
							}
						</TableBody>
					)}
				</InfoTable>
			</Card>
			{(block && (extrinsics.loading || extrinsics.items.length > 0)) && (
				<Card>
					<TabbedContent>
						<TabPane
							label="Extrinsics"
							count={extrinsics.pagination.totalCount}
							loading={extrinsics.loading}
							value="extrinsics"
						>
							<ExtrinsicsTable
								items={extrinsics.items}
								loading={extrinsics.loading}
								network={network}
								pagination={extrinsics.pagination}
							/>
						</TabPane>
						<TabPane
							label={
								<>
									<span>Calls ({calls.pagination.totalCount})</span>
									{calls.loading && <CircularProgress size={14} />}
								</>
							}
							value="calls"
						>
							<CallsTable
								items={calls.items}
								loading={calls.loading}
								network={network}
								pagination={calls.pagination}
							/>
						</TabPane>
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
							/>
						</TabPane>
					</TabbedContent>
				</Card>
			)}
		</>
	);
}

export default BlockPage;
