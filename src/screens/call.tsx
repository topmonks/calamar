import EventsTable from "../components/events/EventsTable";
import InfoTable from "../components/InfoTable";
import { TableBody, TableCell, TableRow, Tooltip } from "@mui/material";
import CopyToClipboardButton from "../components/CopyToClipboardButton";
import { useParams } from "react-router-dom";
import { useCall } from "../hooks/useCall";
import CrossIcon from "../assets/cross-icon.png";
import CheckIcon from "../assets/check-icon.png";
import { convertTimestampToTimeFromNow, formatDate } from "../utils/convertTimestampToTimeFromNow";
import ParamsTable from "../components/ParamsTable";
import { Card, CardHeader } from "../components/Card";
import { Link } from "../components/Link";

type CallPageParams = {
	network: string;
	id: string;
};

export const CallPage: React.FC = () => {
	const { network, id } = useParams() as CallPageParams;

	const [call, { loading }] = useCall(network, { id_eq: id });

	return (<>
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
						<TableRow>
							<TableCell>Metadata docs</TableCell>
							<TableCell>To be filled in later</TableCell>
						</TableRow>
						{call.args && (
							<TableRow>
								<TableCell>Parameters</TableCell>
								<TableCell>
									<ParamsTable args={call.args} />
								</TableCell>
							</TableRow>
						)}
						<TableRow>
							<TableCell>Version</TableCell>
							<TableCell>{call.extrinsic.version}</TableCell>
						</TableRow>

						<TableRow>
							<TableCell>Origin</TableCell>
							<TableCell>{call.origin}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Parrent</TableCell>
							<TableCell>
								<Link to={`/${network}/xx/${call.block.id}`}> {/* fill in later */}
									{call.parrent.id}
								</Link>
								<CopyToClipboardButton value={call.parrent.id} />
							</TableCell>
						</TableRow>
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
							<TableCell>Block number</TableCell>
							<TableCell>
								<Link to={`/${network}/block/${call.block.id}`}>
									{call.block.id}
								</Link>
								<CopyToClipboardButton value={call.block.id} />
							</TableCell>
						</TableRow>
					</TableBody>
				)}
			</InfoTable>
		</Card>
	</>);
};
