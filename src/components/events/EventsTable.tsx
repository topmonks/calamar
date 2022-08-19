import React from "react";
import { TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

import { Pagination } from "../../hooks/usePagination";

import EventParamsTable from "./EventParamsTable";
import ItemsTable from "../ItemsTable";
import { shortenHash } from "../../utils/shortenHash";

const HeaderTableRow = styled(TableRow)`
  th {
    font-weight: bold !important;
  }
`;

export type EventsTableProps = {
  network: string;
  items: any[];
  pagination: Pagination;
  showExtrinsic?: boolean;
  loading?: boolean;
};

function EventsTable(props: EventsTableProps) {
  const { network, items, pagination, showExtrinsic, loading } = props;

  return (
    <ItemsTable
      items={items}
      loading={loading}
      noItemsMessage="No events found"
      pagination={pagination}
    >
      <TableHead>
        <HeaderTableRow>
          <TableCell>Id</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Parameters</TableCell>
          {showExtrinsic && <TableCell>Extrinsic</TableCell>}
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
            {showExtrinsic && event.extrinsic?.hash && (
              <TableCell>
                <Link to={`/${network}/search?query=${event.extrinsic.hash}`}>
                  {shortenHash(event.extrinsic.hash)}
                </Link>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </ItemsTable>
  );
}

export default EventsTable;
