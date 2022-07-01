import {
  Button,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Toolbar,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { extrinsicsState } from "../../state/extrinsics";
import { useRecoilState } from "recoil";
import { shortenHash } from "../../utils/shortenHash";
import {
  convertTimestampToTimeFromNow,
  formatDate,
} from "../../utils/convertTimestampToTimeFromNow";
import { useNavigate } from "react-router-dom";
import {
  ExtrinsicsFilter,
  getExtrinsics,
} from "../../services/extrinsicsService";
import { usePagination } from "../../hooks/usePagination";
import { TablePagination } from "../TablePagination";
import PaginatedTable from "../PaginatedTable";

export type ExtrinsicsTableProps = {
  filter: ExtrinsicsFilter;
};

function ExtrinsicsTable(props: ExtrinsicsTableProps) {
  const { filter } = props;

  const [extrinsics, setExtrinsics] = useState([]);

  const pagination = usePagination();

  useEffect(() => {
    const getExtrinsicsAndSetState = async (limit: number, offset: number) => {
      const extrinsics = await getExtrinsics(limit, offset, filter);
      const nextExtrinsics = await getExtrinsics(limit, offset + limit, filter);

      console.log("nextE", nextExtrinsics);

      setExtrinsics(extrinsics);
      pagination.setHasNext(nextExtrinsics.length > 0);
    };

    getExtrinsicsAndSetState(pagination.limit, pagination.offset);

    const interval = setInterval(async () => {
      await getExtrinsicsAndSetState(pagination.limit, pagination.offset);
    }, 10000);

    return () => clearInterval(interval);
  }, [filter, pagination, setExtrinsics]);

  console.log("hasN", pagination.hasNext);

  return (
    <PaginatedTable pagination={pagination} title="Extrinsics">
      <TableHead>
        <TableRow>
          <TableCell>Id</TableCell>
          <TableCell>Section</TableCell>
          <TableCell>Method</TableCell>
          <TableCell>Signer</TableCell>
          <TableCell>Time</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {extrinsics.map((extrinsic: any) => (
          <TableRow key={extrinsic.id}>
            <TableCell>{extrinsic.id}</TableCell>
            <TableCell>{extrinsic.section}</TableCell>
            <TableCell>{extrinsic.method}</TableCell>
            <TableCell>{shortenHash(extrinsic.signer)}</TableCell>
            <TableCell>
              <Tooltip placement="top" title={formatDate(extrinsic.created_at)}>
                <span>
                  {convertTimestampToTimeFromNow(extrinsic.created_at)}
                </span>
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </PaginatedTable>
  );
}

export default ExtrinsicsTable;
