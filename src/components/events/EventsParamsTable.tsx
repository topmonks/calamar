import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import React from "react";
import styled from "@emotion/styled";

const StyledTable = styled(Table)`
  background-color: rgba(0, 0, 0, 0.05);
`;

const TypeCell = styled(TableCell)`
  opacity: 0.75;
`;

function renderParam(param: any) {
  try {
    if (typeof param.value === "object") {
      const types = JSON.parse(param.type);

      const valueKeys = Object.keys(param.value);
      const typeKeys = Object.keys(types);

      if (
        valueKeys.length === typeKeys.length &&
        valueKeys.every((k) => typeKeys.includes(k))
      ) {
        valueKeys.sort();

        return (
          <>
            {valueKeys.map((key) => (
              <TableRow key={key}>
                <TableCell>
                  <strong>{key}</strong>
                </TableCell>
                <TableCell>{param.value[key]}</TableCell>
                <TypeCell>{types[key]}</TypeCell>
              </TableRow>
            ))}
          </>
        );
      }
    }
  } catch (e) {
    // nothing
  }

  return (
    <TableRow>
      <TableCell colSpan={2}>{param.value}</TableCell>
      <TypeCell>{param.type}</TypeCell>
    </TableRow>
  );
}

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
  console.log("P", params);

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      style={{ maxWidth: "100%", width: "fit-content" }}
    >
      <StyledTable size="small">
        <TableBody>{params.map(renderParam)}</TableBody>
      </StyledTable>
    </TableContainer>
  );
}

export default EventsParamsTable;
