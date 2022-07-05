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
import { shortenHash } from "../../utils/shortenHash";
import {
  convertTimestampToTimeFromNow,
  formatDate,
} from "../../utils/convertTimestampToTimeFromNow";
import { Link, useNavigate } from "react-router-dom";
import {
  ExtrinsicsFilter,
  getExtrinsics,
} from "../../services/extrinsicsService";
import { usePagination } from "../../hooks/usePagination";
import { TablePagination } from "../TablePagination";
import PaginatedTable from "../PaginatedTable";

export type ExtrinsicsTableProps = {
  filter: ExtrinsicsFilter;
  columns?: string[];
};

function ExtrinsicsTable({
  filter = {},
  columns = ["id", "section", "method", "signer", "time"],
}: ExtrinsicsTableProps) {
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
          {columns.find((value) => value === "id") && <TableCell>Id</TableCell>}
          {columns.find((value) => value === "section") && (
            <TableCell>Section</TableCell>
          )}
          {columns.find((value) => value === "method") && (
            <TableCell>Method</TableCell>
          )}
          {columns.find((value) => value === "signer") && (
            <TableCell>Signer</TableCell>
          )}
          {columns.find((value) => value === "time") && (
            <TableCell>Time</TableCell>
          )}
        </TableRow>
      </TableHead>
      <TableBody>
        {extrinsics.map((extrinsic: any) => (
          <TableRow key={extrinsic.id}>
            {columns.find((value) => value === "id") && (
              <Link to={`/extrinsic/${extrinsic.id}`}>
                {shortenHash(extrinsic.id)}
              </Link>
            )}
            {columns.find((value) => value === "hash") && (
              <TableCell>{shortenHash(extrinsic.hash)}</TableCell>
            )}
            {columns.find((value) => value === "section") && (
              <TableCell>{extrinsic.section}</TableCell>
            )}
            {columns.find((value) => value === "method") && (
              <TableCell>{extrinsic.method}</TableCell>
            )}
            {columns.find((value) => value === "signer") && (
              <TableCell>{shortenHash(extrinsic.signer)}</TableCell>
            )}
            {columns.find((value) => value === "time") && (
              <TableCell>
                <Tooltip
                  placement="top"
                  title={formatDate(extrinsic.created_at)}
                >
                  <span>
                    {convertTimestampToTimeFromNow(extrinsic.created_at)}
                  </span>
                </Tooltip>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </PaginatedTable>
  );
}

export default ExtrinsicsTable;
