import React, { PropsWithChildren } from "react";
import { Table, TableContainer } from "@mui/material";

import { Pagination } from "../hooks/usePagination";

import Loading from "./Loading";
import NotFound from "./NotFound";
import { TablePagination } from "./TablePagination";

export type ItemsTableProps = PropsWithChildren<{
  pagination: Pagination;
  loading?: boolean;
  items?: any[];
  noItemsMessage?: string;
}>;

function ItemsTable(props: ItemsTableProps) {
  const {
    pagination,
    children,
    loading,
    items,
    noItemsMessage = "No items found",
  } = props;

  if (loading) {
    return <Loading />;
  }

  if (items && items.length === 0) {
    return <NotFound>{noItemsMessage}</NotFound>;
  }

  return (
    <>
      <TableContainer>
        <Table className="calamar-table">{children}</Table>
      </TableContainer>
      <TablePagination {...pagination} />
    </>
  );
}

export default ItemsTable;
