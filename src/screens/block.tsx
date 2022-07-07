import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
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
import { getBlocks } from "../services/blocksService";
import EventsTable from "../components/events/EventsTable";
import { getExtrinsics } from "../services/extrinsicsService";
import OldExtrinsicsTable from "../components/extrinsics/OldExtrinsicsTable";
import { useBlockById } from "../hooks/useBlockById";
import { useExtrinsics } from "../hooks/useExtrinsics";
import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";

function BlockPage() {
  let { id } = useParams();

  const block = useBlockById(id);
  const extrinsics = useExtrinsics({ block: { id_eq: id } });

  if (!block) {
    return null;
  }

  console.log(block);
  console.log(extrinsics);

  return (
    <div>
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>{block.id}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Hash</TableCell>
              <TableCell>{block.hash}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Block height</TableCell>
              <TableCell>{block.height}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>
                <Tooltip placement="top" title={formatDate(block.timestamp)}>
                  <span>{convertTimestampToTimeFromNow(block.timestamp)}</span>
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <ExtrinsicsTable
        items={extrinsics.items}
        pagination={extrinsics.pagination}
      />
      {/*<OldExtrinsicsTable
        filter={{ blockId: block.id }}
        order={{ created_at: "desc" }}
  />*/}
    </div>
  );
}

export default BlockPage;
