import React, { ReactNode } from "react";
import { Paper, Table, TableContainer, Toolbar } from "@mui/material";
import { PropsWithChildren } from "react";
import { Pagination } from "../hooks/usePagination";
import { TablePagination } from "./TablePagination";

export type PaginatedTableProps = PropsWithChildren<{
  title: ReactNode;
  extra?: ReactNode;
  pagination: Pagination;
}>;

function PaginatedTable(props: PaginatedTableProps) {
  const { title, extra = null, pagination, children } = props;

  return (
    <Paper>
      {title && (
        <Toolbar disableGutters>
          <h3 style={{ margin: 0, paddingLeft: 16, paddingRight: 16 }}>
            {title}
          </h3>
          {extra}
        </Toolbar>
      )}
      <TableContainer>
        <Table>{children}</Table>
      </TableContainer>
      <TablePagination {...pagination} />
    </Paper>
  );
}

export default PaginatedTable;
