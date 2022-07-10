import React from "react";
import { TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import styled from "@emotion/styled";
import { Link, useNavigate } from "react-router-dom";

import { Pagination } from "../../hooks/usePagination";

import EventParamsTable from "./EventParamsTable";
import PaginatedTable from "../PaginatedTable";
import { shortenHash } from "../../utils/shortenHash";
import { getExtrinsic } from "../../services/extrinsicsService";

const HeaderTableRow = styled(TableRow)`
  th {
    font-weight: bold !important;
  }
`;

export type EventsTableProps = {
  items: any[];
  pagination: Pagination;
  showExtrinsic?: boolean;
};

function EventsTable(props: EventsTableProps) {
  const { items, pagination, showExtrinsic } = props;
  const navigate = useNavigate();

  const navigateToExtrinsicPage = async (hash: string) => {
    const extrinsic = await getExtrinsic({ hash_eq: hash });
    if (extrinsic) {
      navigate(`/extrinsic/${extrinsic.id}`);
    }
  };

  return (
    <PaginatedTable pagination={pagination}>
      <TableHead>
        <HeaderTableRow>
          <TableCell>Id</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Pos</TableCell>
          <TableCell>Index in block</TableCell>
          <TableCell>Parameters</TableCell>
          {showExtrinsic && <TableCell>Extrinsic</TableCell>}
        </HeaderTableRow>
      </TableHead>
      <TableBody>
        {items.map((event: any) => (
          <TableRow key={event.id}>
            <TableCell>{event.id}</TableCell>
            <TableCell>{event.name}</TableCell>
            <TableCell>{event.pos}</TableCell>
            <TableCell>{event.indexInBlock}</TableCell>
            <TableCell>
              <EventParamsTable args={event.args} />
            </TableCell>
            {showExtrinsic && event.extrinsic?.hash && (
              <TableCell>
                <a
                  onClick={() => navigateToExtrinsicPage(event.extrinsic.hash)}
                  style={{ cursor: "pointer" }}
                >
                  {shortenHash(event.extrinsic.hash)}
                </a>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </PaginatedTable>
  );
}

export default EventsTable;
