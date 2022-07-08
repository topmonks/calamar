import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import {
  convertTimestampToTimeFromNow,
  formatDate,
} from "../utils/convertTimestampToTimeFromNow";
import { useBlockById } from "../hooks/useBlockById";
import { useExtrinsics } from "../hooks/useExtrinsics";
import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";
import ResultLayout from "../components/ResultLayout";
import CopyToClipboardButton from "../components/CopyToClipboardButton";

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
    <ResultLayout>
      <div className="calamar-card">
        <div className="calamar-table-header" style={{ paddingBottom: 48 }}>
          Block #{block.id}
        </div>
        <TableContainer>
          <Table className="calamar-info-table">
            <TableBody>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>{block.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Hash</TableCell>
                <TableCell>
                  {block.hash}
                  <span style={{ marginLeft: 8 }}>
                    <CopyToClipboardButton value={block.hash} />
                  </span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Block height</TableCell>
                <TableCell>{block.height}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>
                  <Tooltip
                    arrow
                    placement="top"
                    title={formatDate(block.timestamp)}
                  >
                    <span>
                      {convertTimestampToTimeFromNow(block.timestamp)}
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <ExtrinsicsTable
          items={extrinsics.items}
          pagination={extrinsics.pagination}
        />
      </div>
    </ResultLayout>
  );
}

export default BlockPage;
