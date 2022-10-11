import { Link, useParams } from "react-router-dom";
import InfoTable from "../components/InfoTable";
import { useEvent } from "../hooks/useEvent";
import { TableBody, TableCell, TableRow, Tooltip } from "@mui/material";
import CopyToClipboardButton from "../components/CopyToClipboardButton";
import ParamsTable from "../components/ParamsTable";
import { convertTimestampToTimeFromNow, formatDate } from "../utils/convertTimestampToTimeFromNow";

type EventPageParams = {
    network: string;
    id: string;
};

export const EventPage: React.FC = () => {
    const { network, id } = useParams() as EventPageParams;

    const [event, { loading }] = useEvent(network, id);
    console.log(event)
    return (<>
        <div className="calamar-card">
            <div className="calamar-table-header" style={{ paddingBottom: 48 }}>
                Event #{id}
            </div>
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
                        <TableRow>
                            <TableCell>Metadata docs</TableCell>
                            <TableCell>
                                To be filled in later
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Parameters</TableCell>
                            <TableCell>
                                <ParamsTable args={event.args} />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Version</TableCell>
                            <TableCell>
                                {event.extrinsic.version}
                            </TableCell>
                        </TableRow>
                        {event.call && <TableRow>
                            <TableCell>Call id</TableCell>
                            <Link
                                to={`/${network}/call/${event.call.id}`}
                            >
                                {event.call.id}
                            </Link>
                            <span style={{ marginLeft: 8 }}>
                                <CopyToClipboardButton
                                    value={event.call.id}
                                />
                            </span>
                        </TableRow>}
                        <TableRow>
                            <TableCell>Extrinsic id</TableCell>
                            <Link
                                to={`/${network}/extrinsic/${event.extrinsic.id}`}
                            >
                                {event.extrinsic.id}
                            </Link>
                            <span style={{ marginLeft: 8 }}>
                                <CopyToClipboardButton
                                    value={event.extrinsic.id}
                                />
                            </span>
                        </TableRow>
                        <TableRow>
                            <TableCell>Block number</TableCell>
                            <Link
                                to={`/${network}/block/${event.block.id}`}
                            >
                                {event.block.id}
                            </Link>
                            <span style={{ marginLeft: 8 }}>
                                <CopyToClipboardButton
                                    value={event.block.id}
                                />
                            </span>
                        </TableRow>
                    </TableBody>
                )}
            </InfoTable>
        </div>
    </>)
}