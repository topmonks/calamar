import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
} from "@mui/material";
import styled from "@emotion/styled";
import EventsTableRow from "../events/EventsTableRow";
import EventsParamsTable from "../events/EventsParamsTable";
import { getEvents } from "../../services/eventsService";
import { usePagination } from "../../hooks/usePagination";
import { TablePagination } from "../TablePagination";
import PaginatedTable from "../PaginatedTable";

const HeaderTableRow = styled(TableRow)`
  th {
    font-weight: bold !important;
  }
`;

export type ExtrinsicEventsTableProps = {
  extrinsicId: string;
};

function ExtrinsicEventsTable(props: ExtrinsicEventsTableProps) {
  const { extrinsicId } = props;

  const [events, setEvents] = useState([]);

  const pagination = usePagination();

  useEffect(() => {
    const getEventsAndSetState = async (limit: number, offset: number) => {
      const filter = { extrinsic: { id: extrinsicId } };

      const events = await getEvents(limit, offset, filter);
      const nextEvents = await getEvents(limit, offset + limit, filter);

      setEvents(events);
      pagination.setHasNext(nextEvents.length > 0);
    };
    getEventsAndSetState(pagination.limit, pagination.offset);
  }, [extrinsicId, pagination]);

  return (
    <PaginatedTable pagination={pagination} title="Events">
      <TableHead>
        <HeaderTableRow>
          <TableCell>Id</TableCell>
          <TableCell>Section</TableCell>
          <TableCell>Method</TableCell>
          <TableCell>Parameters</TableCell>
        </HeaderTableRow>
      </TableHead>
      <TableBody>
        {events.map((event: any) => (
          <TableRow key={event.id}>
            <TableCell>{event.id}</TableCell>
            <TableCell>{event.section}</TableCell>
            <TableCell>{event.method}</TableCell>
            <TableCell>
              <EventsParamsTable params={event.params} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </PaginatedTable>
  );
}

export default ExtrinsicEventsTable;
