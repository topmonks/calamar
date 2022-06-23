import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import styled from "@emotion/styled";
const HeaderTableRow = styled(TableRow)`
  th {
    font-weight: bold !important;
  }
`;

function EventsParamsTable({
  params,
}: {
  params: [
    {
      name: string;
      type: string;
      value: any;
    }
  ];
}) {
  const stringifyValue = (value: any) => {
    if (typeof value === "object") {
      return JSON.stringify(value);
    }
    return value;
  };
  return (
    <TableContainer
      component={Paper}
      style={{ maxWidth: "100%", width: "fit-content" }}
    >
      <Table>
        <TableHead>
          <HeaderTableRow>
            <TableCell>Type</TableCell>
            <TableCell>Value</TableCell>
          </HeaderTableRow>
        </TableHead>
        <TableBody>
          {params.map((param: any) => (
            <TableRow key={param.type}>
              <TableCell>{param.type}</TableCell>
              <TableCell>{stringifyValue(param.value)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default EventsParamsTable;
