import EventsTable from "../components/events/EventsTable";
import InfoTable from "../components/InfoTable";
import { CircularProgress, TableBody, TableCell, TableRow, Tooltip } from "@mui/material";
import CopyToClipboardButton from "../components/CopyToClipboardButton";
import { useParams } from "react-router-dom";
import { useCall } from "../hooks/useCall";
import CrossIcon from "../assets/cross-icon.png";
import CheckIcon from "../assets/check-icon.png";
import { convertTimestampToTimeFromNow, formatDate } from "../utils/convertTimestampToTimeFromNow";
import ParamsTable from "../components/ParamsTable";
import { Card, CardHeader } from "../components/Card";
import { Link } from "../components/Link";
import { useEvents } from "../hooks/useEvents";
import { shortenHash } from "../utils/shortenHash";
import { TabbedContent, TabPane } from "../components/TabbedContent";

type CallPageParams = {
	network: string;
	id: string;
};

export const CallPage: React.FC = () => {
	const { network, id } = useParams() as CallPageParams;

	const [call, { loading }] = useCall(network, id);
	const events = useEvents(network, { call: { id_eq: id } }, "id_ASC");

	return (
		<>
			<Card>
				<CardHeader style={{ paddingBottom: 48 }}>
					Call #{id}
				</CardHeader>
				<InfoTable
					item={call}
					loading={loading}
					noItemMessage="No call found"
				>
					{call && (
						<TableBody>
							<TableRow>
								<TableCell>Id</TableCell>
								<TableCell>{call.id}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>{call.name}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Block time</TableCell>
								<TableCell>
									<Tooltip
										arrow
										placement="top"
										title={formatDate(call.block.timestamp)}
									>
										<span>
											{convertTimestampToTimeFromNow(call.block.timestamp)}
										</span>
									</Tooltip>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Success</TableCell>
								<TableCell>
									<img src={call.success ? CheckIcon : CrossIcon} />
								</TableCell>
							</TableRow>
							{/*<TableRow>
							<TableCell>Metadata docs</TableCell>
							<TableCell>To be filled in later</TableCell>
				</TableRow>*/}
							{call.args && (
								<TableRow>
									<TableCell>Parameters</TableCell>
									<TableCell>
										<ParamsTable args={call.args} />
									</TableCell>
								</TableRow>
							)}
							<TableRow>
								<TableCell>Spec version</TableCell>
								<TableCell>{call.block.spec.specVersion}</TableCell>
							</TableRow>

							<TableRow>
								<TableCell>Sender</TableCell>
								<TableCell>{(call.origin && call.origin.value.__kind !== "None") ? shortenHash(call.origin.value.value) : "None"}</TableCell>
							</TableRow>
							{call.parrent && <TableRow>
								<TableCell>Parent</TableCell>
								<TableCell>
									<Link to={`/${network}/call/${call.parent.id}`}>
										{call.parent.id}
									</Link>
									<CopyToClipboardButton value={call.parent.id} />
								</TableCell>
							</TableRow>}
							<TableRow>
								<TableCell>Extrinsic id</TableCell>
								<TableCell>
									<Link to={`/${network}/extrinsic/${call.extrinsic.id}`}>
										{call.extrinsic.id}
									</Link>
									<CopyToClipboardButton value={call.extrinsic.id} />
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Block height</TableCell>
								<TableCell>
									<Link to={`/${network}/block/${call.block.id}`}>
										{call.block.height}
									</Link>
									<CopyToClipboardButton value={call.block.height} />
								</TableCell>
							</TableRow>
						</TableBody>
					)}
				</InfoTable>
			</Card>
			{(events.loading || events.items.length > 0) &&
				<Card>
					<TabbedContent>
						<TabPane
							label="Events"
							count={events.pagination.totalCount}
							loading={events.loading}
							value="events"
						>
							<EventsTable
								loading={events.loading}
								items={events.items}
								network={network}
								pagination={events.pagination}
							/>
						</TabPane>
						<></>
					</TabbedContent>
				</Card>
			}
		</>
	);
};
