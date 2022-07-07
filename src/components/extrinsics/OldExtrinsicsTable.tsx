import React from "react";
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { shortenHash } from "../../utils/shortenHash";
import {
  convertTimestampToTimeFromNow,
  formatDate,
} from "../../utils/convertTimestampToTimeFromNow";
import { Link } from "react-router-dom";
import {
  ExtrinsicsFilter,
  getExtrinsics,
} from "../../services/extrinsicsService";
import { usePagination } from "../../hooks/usePagination";
import PaginatedTable from "../PaginatedTable";
import { Order } from "../../model/order";
import { useExtrinsics } from "../../hooks/useExtrinsics";

export type ExtrinsicsTableProps = {
  filter?: ExtrinsicsFilter;
  order?: Order;
  columns?: string[];
};

function OldExtrinsicsTable({
  filter,
  order,
  columns = ["id", "section", "method", "signer", "time"],
}: ExtrinsicsTableProps) {
  const [extrinsics, pagination] = useExtrinsics(filter, order);

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
              <TableCell>
                <Link to={`/extrinsic/${extrinsic.id}`}>{extrinsic.id}</Link>
              </TableCell>
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

export default OldExtrinsicsTable;
