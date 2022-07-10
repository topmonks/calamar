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
import ItemsTable from "../ItemsTable";
import CopyToClipboardButton from "../CopyToClipboardButton";

export type ExtrinsicsTableProps = {
  items: any[];
  pagination: Pagination;
  title?: ReactNode;
  columns?: string[];
  loading?: boolean;
};

function ExtrinsicsTable(props: ExtrinsicsTableProps) {
  const {
    items,
    pagination,
    columns = ["id", "name", "signer", "time"],
    loading,
  } = props;

  return (
    <ItemsTable
      items={items}
      loading={loading}
      noItemsMessage="No extrinsics found"
      pagination={pagination}
    >
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
            <TableCell>Account</TableCell>
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
                <Link to={`/account/${extrinsic.signature?.address}`}>
                  {shortenHash(extrinsic.signature?.address)}
                </Link>
                {extrinsic.signature?.address && (
                  <span style={{ marginLeft: 8 }}>
                    <CopyToClipboardButton
                      value={extrinsic.signature?.address}
                    />
                  </span>
                )}
              </TableCell>
            )}
            {columns.find((value) => value === "time") && (
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
            )}
          </TableRow>
        ))}
      </TableBody>
    </ItemsTable>
  );
}

export default ExtrinsicsTable;
