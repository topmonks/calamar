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
import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";

function BlockPage() {
  const [block, setBlock] = React.useState<any>(null);
  let { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const block = await getBlocks(1, 0, { id: { _eq: id } });
      setBlock(block[0]);
    };
    fetchData();
  }, [id]);

  if (!block) {
    return null;
  }

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
                <Tooltip placement="top" title={formatDate(block.created_at)}>
                  <span>{convertTimestampToTimeFromNow(block.created_at)}</span>
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <ExtrinsicsTable filter={{ blockId: block.id }} />
    </div>
  );
}

export default BlockPage;
