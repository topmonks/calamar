import React, { useEffect } from "react";
import { getExtrinsics } from "../services/extrinsicsService";
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
import { useExtrinsic } from "../hooks/useExtrinsic";
import { useEvents } from "../hooks/useEvents";
import ResultLayout from "../components/ResultLayout";
import CrossIcon from "../assets/cross-icon.png";
import CheckIcon from "../assets/check-icon.png";
import CopyToClipboardButton from "../components/CopyToClipboardButton";

function ExtrinsicPage() {
  let { id } = useParams();

  const extrinsic = useExtrinsic({ id_eq: id }, { skip: !id });
  const events = useEvents({ extrinsic: { id_eq: id } }, { skip: !id });

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
          <Table className="calamar-info-table">
            <TableBody>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>{extrinsic.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Hash</TableCell>
                <TableCell>
                  {extrinsic.hash}
                  <span style={{ marginLeft: 8 }}>
                    <CopyToClipboardButton value={extrinsic.hash} />
                  </span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Block time</TableCell>
                <TableCell>
                  <Tooltip
                    arrow
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
                  <span style={{ marginLeft: 8 }}>
                    <CopyToClipboardButton value={extrinsic.block.hash} />
                  </span>
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
              {extrinsic.signature?.address.value && (
                <TableRow>
                  <TableCell>Account</TableCell>
                  <TableCell>
                    <Link to={`/account/${extrinsic.signature.address.value}`}>
                      {extrinsic.signature.address.value}
                    </Link>
                  </TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell>Index in block</TableCell>
                <TableCell>{extrinsic.indexInBlock}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Success</TableCell>
                <TableCell>
                  <img src={extrinsic.success ? CheckIcon : CrossIcon} />
                </TableCell>
              </TableRow>
              {extrinsic.tip && (
                <TableRow>
                  <TableCell>Tip</TableCell>
                  <TableCell>{extrinsic.tip}</TableCell>
                </TableRow>
              )}
              {extrinsic.fee && (
                <TableRow>
                  <TableCell>Fee</TableCell>
                  <TableCell>{extrinsic.fee}</TableCell>
                </TableRow>
              )}
              {extrinsic.error && (
                <TableRow>
                  <TableCell>Error</TableCell>
                  <TableCell>{extrinsic.error}</TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell>Version</TableCell>
                <TableCell>{extrinsic.version}</TableCell>
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
