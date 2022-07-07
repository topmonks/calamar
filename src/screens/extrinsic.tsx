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
import EventsTable from "../components/events/EventsTable";
import { useExtrinsicById } from "../hooks/useExtrinsicById";
import { useEvents } from "../hooks/useEvents";
import ResultLayout from "../components/ResultLayout";
import CrossIcon from "../assets/cross-icon.png";
import CheckIcon from "../assets/check-icon.png";

function ExtrinsicPage() {
  let { id } = useParams();

  const extrinsic = useExtrinsicById(id);
  const events = useEvents({ extrinsic: { id_eq: id } });

  if (!extrinsic) {
    return null;
  }

  return (
    <ResultLayout>
      <div className="calamar-card">
        <div className="calamar-table-header" style={{ paddingBottom: 48 }}>
          Extrinsic #{extrinsic.id}
        </div>
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
                  <img src={extrinsic.signature ? CheckIcon : CrossIcon} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Account</TableCell>

                <TableCell>
                  {extrinsic.signature?.address.value && (
                    <Link to={`/account/${extrinsic.signature.address.value}`}>
                      {extrinsic.signature.address.value}
                    </Link>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <EventsTable items={events.items} pagination={events.pagination} />
      </div>
    </ResultLayout>
  );
}

export default ExtrinsicPage;
