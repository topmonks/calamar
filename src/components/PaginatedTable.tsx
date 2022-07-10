import React, { PropsWithChildren } from "react";
import { Table, TableContainer } from "@mui/material";
import styled from "@emotion/styled";

import { Pagination } from "../hooks/usePagination";

import Spinner from "./Spinner";
import { TablePagination } from "./TablePagination";

const LoadingBox = styled.div`
  padding: 16px 0;
  text-align: center;
`;

const NoItemsBox = styled.div`
  padding: 16px 0;
  text-align: center;
  line-height: 54px;
`;

export type PaginatedTableProps = PropsWithChildren<{
  pagination: Pagination;
  loading?: boolean;
  items?: any[];
  noItemsMessage?: string;
}>;

function PaginatedTable(props: PaginatedTableProps) {
  const {
    pagination,
    children,
    loading,
    items,
    noItemsMessage = "No items found",
  } = props;

  if (loading) {
    return (
      <LoadingBox>
        <Spinner />
      </LoadingBox>
    );
  }

  if (items && items.length === 0) {
    return <NoItemsBox>{noItemsMessage}</NoItemsBox>;
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

export default PaginatedTable;
