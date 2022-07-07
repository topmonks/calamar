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
import { getBlocks } from "../services/blocksService";
import OldExtrinsicsTable from "../components/extrinsics/OldExtrinsicsTable";
import ResultLayout from "../components/ResultLayout";

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
                    <span>
                      {convertTimestampToTimeFromNow(block.created_at)}
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <OldExtrinsicsTable
          filter={{ blockId: block.id }}
          order={{ created_at: "desc" }}
        />
      </div>
    </ResultLayout>
  );
}

export default BlockPage;
