import { useParams } from "react-router-dom";
import InfoTable from "../components/InfoTable";
import { useEvent } from "../hooks/useEvent";
import { TableBody, TableCell, TableRow, Tooltip } from "@mui/material";
import CopyToClipboardButton from "../components/CopyToClipboardButton";
import ParamsTable from "../components/ParamsTable";
import { convertTimestampToTimeFromNow, formatDate } from "../utils/convertTimestampToTimeFromNow";
import { Card, CardHeader } from "../components/Card";
import { Link } from "../components/Link";

type EventPageParams = {
	network: string;
	id: string;
};

export const EventPage: React.FC = () => {
	const { network, id } = useParams() as EventPageParams;

	const [event, { loading }] = useEvent(network, id);
	
	return (<>
		<Card>
			<CardHeader style={{ paddingBottom: 48 }}>
				Event #{id}
			</CardHeader>
			<InfoTable
				item={event}
				loading={loading}
				noItemMessage="No event found"
			>
				{event && (
					<TableBody>
						<TableRow>
							<TableCell>Id</TableCell>
							<TableCell>{event.id}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell>{event.name}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Block time</TableCell>
							<TableCell>
								<Tooltip
									arrow
									placement="top"
									title={formatDate(event.block.timestamp)}
								>
									<span>
										{convertTimestampToTimeFromNow(event.block.timestamp)}
									</span>
								</Tooltip>
							</TableCell>
						</TableRow>
						{/*<TableRow>
							<TableCell>Metadata docs</TableCell>
							<TableCell>
								To be filled in later
							</TableCell>
				</TableRow>*/}
						<TableRow>
							<TableCell>Parameters</TableCell>
							<TableCell>
								<ParamsTable args={event.args} />
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Spec version</TableCell>
							<TableCell>
								{event.block.spec.specVersion}
							</TableCell>
						</TableRow>
						{event.call && <TableRow>
							<TableCell>Call id</TableCell>
							<TableCell>
								<Link
									to={`/${network}/call/${event.call.id}`}
								>
									{event.call.id}
								</Link>
								<CopyToClipboardButton
									value={event.call.id}
								/>
							</TableCell>
						</TableRow>}
						<TableRow>
							<TableCell>Extrinsic id</TableCell>
							<TableCell>
								<Link
									to={`/${network}/extrinsic/${event.extrinsic.id}`}
								>
									{event.extrinsic.id}
								</Link>
								<CopyToClipboardButton
									value={event.extrinsic.id}
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Block height</TableCell>
							<TableCell>
								<Link
									to={`/${network}/block/${event.block.id}`}
								>
									{event.block.height}
								</Link>
								<CopyToClipboardButton
									value={event.block.height}
								/>
							</TableCell>
						</TableRow>
					</TableBody>
				)}
			</InfoTable>
		</Card>
	</>);
};