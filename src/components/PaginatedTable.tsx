import React from "react";
import { Table, TableContainer } from "@mui/material";
import { PropsWithChildren } from "react";
import { Pagination } from "../hooks/usePagination";
import { TablePagination } from "./TablePagination";

export type PaginatedTableProps = PropsWithChildren<{
  pagination: Pagination;
}>;

function PaginatedTable(props: PaginatedTableProps) {
  const { pagination, children } = props;

  return (
    <>
      <TableContainer>
        <Table className="calamar-table">{children}</Table>
      </TableContainer>
      <TablePagination {...pagination} />
    </>
  );
}

export default PaginatedTable;
