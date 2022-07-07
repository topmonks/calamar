import React, { useEffect, useState } from "react";
import { TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import styled from "@emotion/styled";

import { EventsFilter, getEvents } from "../../services/eventsService";
import { Pagination, usePagination } from "../../hooks/usePagination";

import EventParamsTable from "./EventParamsTable";
import PaginatedTable from "../PaginatedTable";

const HeaderTableRow = styled(TableRow)`
  th {
    font-weight: bold !important;
  }
`;

export type EventsTableProps = {
  items: any[];
  pagination: Pagination;
};

function EventsTable(props: EventsTableProps) {
  const { items, pagination } = props;

  return (
    <PaginatedTable pagination={pagination} title="Events">
      <TableHead>
        <HeaderTableRow>
          <TableCell>Id</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Parameters</TableCell>
        </HeaderTableRow>
      </TableHead>
      <TableBody>
        {items.map((event: any) => (
          <TableRow key={event.id}>
            <TableCell>{event.id}</TableCell>
            <TableCell>{event.name}</TableCell>
            <TableCell>
              <EventParamsTable args={event.args} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </PaginatedTable>
  );
}

export default EventsTable;
