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

const StyledTable = styled(Table)`
  background-color: rgba(0, 0, 0, 0.05);
`;

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

  console.log("P", params);

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      style={{ maxWidth: "100%", width: "fit-content" }}
    >
      <StyledTable size="small">
        <TableHead>
          <HeaderTableRow>
            <TableCell>Type</TableCell>
            <TableCell>Value</TableCell>
          </HeaderTableRow>
        </TableHead>
        <TableBody>
          {params.map((param: any) => (
            <TableRow key={param.name}>
              <TableCell>{param.type}</TableCell>
              <TableCell>{stringifyValue(param.value)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </StyledTable>
    </TableContainer>
  );
}

export default EventsParamsTable;
