import React, { ReactNode } from "react";
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
import { Pagination, usePagination } from "../../hooks/usePagination";
import PaginatedTable from "../PaginatedTable";
import { Order } from "../../model/order";

export type ExtrinsicsTableProps = {
  items: any[];
  pagination: Pagination;
  title?: ReactNode;
  columns?: string[];
};

function ExtrinsicsTable({
  items,
  pagination,
  title = "Extrinsics",
  columns = ["id", "name", "signer", "time"],
}: ExtrinsicsTableProps) {
  return (
    <PaginatedTable pagination={pagination} title={title}>
      <TableHead>
        <TableRow>
          {columns.find((value) => value === "id") && <TableCell>Id</TableCell>}
          {columns.find((value) => value === "name") && (
            <TableCell>Name</TableCell>
          )}
          {columns.find((value) => value === "hash") && (
            <TableCell>Hash</TableCell>
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
        {items.map((extrinsic: any) => (
          <TableRow key={extrinsic.id}>
            {columns.find((value) => value === "id") && (
              <TableCell>
                <Link to={`/extrinsic/${extrinsic.id}`}>{extrinsic.id}</Link>
              </TableCell>
            )}
            {columns.find((value) => value === "hash") && (
              <TableCell>{shortenHash(extrinsic.hash)}</TableCell>
            )}
            {columns.find((value) => value === "name") && (
              <TableCell>{extrinsic.call.name}</TableCell>
            )}
            {columns.find((value) => value === "signer") && (
              <TableCell>
                {shortenHash(extrinsic.signature?.address.value)}
              </TableCell>
            )}
            {columns.find((value) => value === "time") && (
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
            )}
          </TableRow>
        ))}
      </TableBody>
    </PaginatedTable>
  );
}

export default ExtrinsicsTable;
