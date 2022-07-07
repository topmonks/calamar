import React, { ReactNode } from "react";
import { Table, TableContainer, Toolbar } from "@mui/material";
import { PropsWithChildren } from "react";
import { Pagination } from "../hooks/usePagination";
import { TablePagination } from "./TablePagination";

export type PaginatedTableProps = PropsWithChildren<{
  title?: ReactNode;
  extra?: ReactNode;
  pagination: Pagination;
}>;

function PaginatedTable(props: PaginatedTableProps) {
  const { title, extra = null, pagination, children } = props;

  return (
    <div className="calamar-card">
      {title && (
        <div className="calamar-table-header" style={{ paddingBottom: 48 }}>
          {title}
        </div>
      )}
      <TableContainer>
        <Table className="calamar-table">{children}</Table>
      </TableContainer>
      <TablePagination {...pagination} />
    </div>
  );
}

export default PaginatedTable;
