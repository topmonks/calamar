import React from "react";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { IconButton, TableCell, TableRow, Toolbar } from "@mui/material";

import { PaginationState } from "../hooks/usePagination";

export type TablePaginationProps = {
  offset: number;
  limit: number;
  hasNext?: boolean;
  hideOnSinglePage?: boolean;
  setPreviousPage: () => void;
  setNextPage: () => void;
};

export function TablePagination(props: TablePaginationProps) {
  const {
    offset,
    limit,
    hasNext = true,
    hideOnSinglePage = true,
    setPreviousPage,
    setNextPage,
  } = props;

  console.log("HN", hasNext);

  if (hideOnSinglePage && offset === 0 && !hasNext) {
    return null;
  }

  return (
    <Toolbar disableGutters>
      <IconButton disabled={offset === 0} onClick={() => setPreviousPage()}>
        <ChevronLeft />
      </IconButton>
      <IconButton disabled={!hasNext} onClick={() => setNextPage()}>
        <ChevronRight />
      </IconButton>
    </Toolbar>
  );
}
