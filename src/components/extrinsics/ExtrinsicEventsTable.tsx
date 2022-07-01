import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import styled from "@emotion/styled";
import EventsTableRow from "../events/EventsTableRow";
import EventsParamsTable from "../events/EventsParamsTable";

const HeaderTableRow = styled(TableRow)`
  th {
    font-weight: bold !important;
  }
`;

function ExtrinsicEventsTable({ events }: { events: any[] }) {
  return (
    <TableContainer>
      <Table aria-label="simple table">
        <TableHead>
          <HeaderTableRow>
            <TableCell />
            <TableCell>Id</TableCell>
            <TableCell>Section</TableCell>
            <TableCell>Method</TableCell>
          </HeaderTableRow>
        </TableHead>
        <TableBody>
          {events.map((event: any) => (
            <EventsTableRow
              expandComponent={<EventsParamsTable params={event.params} />}
              key={event.id}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
              }}
            >
              <TableCell>{event.id}</TableCell>
              <TableCell>{event.section}</TableCell>
              <TableCell>{event.method}</TableCell>
            </EventsTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ExtrinsicEventsTable;
