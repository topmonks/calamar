import React, { useEffect } from "react";
import { getExtrinsicById, getExtrinsics } from "../services/extrinsicsService";
import { Link, useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
} from "@mui/material";
import {
  convertTimestampToTimeFromNow,
  formatDate,
} from "../utils/convertTimestampToTimeFromNow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { getEvents } from "../services/eventsService";
import EventsTable from "../components/events/EventsTable";
import { useExtrinsicById } from "../hooks/useExtrinsicById";
import { useEvents } from "../hooks/useEvents";

function ExtrinsicPage() {
  let { id } = useParams();

  const extrinsic = useExtrinsicById(id);
  const events = useEvents({ extrinsic: { id_eq: id } });

  console.log(extrinsic);
  console.log(events);

  if (!extrinsic) {
    return null;
  }

  return (
    <div>
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>{extrinsic.id}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Hash</TableCell>
              <TableCell>{extrinsic.hash}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Block time</TableCell>
              <TableCell>
                <Tooltip
                  placement="top"
                  title={formatDate(extrinsic.block.timestamp)}
                >
                  <span>
                    {convertTimestampToTimeFromNow(extrinsic.block.timestamp)}
                  </span>
                </Tooltip>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Block hash</TableCell>
              <TableCell>
                <Link to={`/block/${extrinsic.block.id}`}>
                  {extrinsic.block.hash}
                </Link>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>{extrinsic.call.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Is signed</TableCell>
              <TableCell>
                {extrinsic.signature ? <CheckCircleIcon /> : <CancelIcon />}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Account</TableCell>
              <TableCell>{extrinsic.signature?.address.value}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <EventsTable items={events.items} pagination={events.pagination} />
    </div>
  );
}

export default ExtrinsicPage;
