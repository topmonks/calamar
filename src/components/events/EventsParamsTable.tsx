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

import { tryJsonParse } from "../../utils/tryJsonParse";

const StyledTable = styled(Table)`
  background-color: rgba(0, 0, 0, 0.05);
`;

const TypeCell = styled(TableCell)`
  opacity: 0.75;
`;

function renderParamValue(value: any) {
  if (typeof value === "object") {
    return JSON.stringify(value);
  } else if (typeof value === "boolean") {
    return value ? "true" : "false";
  } else {
    return value;
  }
}

function renderParam(param: any) {
  try {
    if (typeof param.value === "object") {
      const type = tryJsonParse(param.type);

      const valueKeys = Object.keys(param.value);
      valueKeys.sort();

      if (typeof type === "object") {
        const typeKeys = Object.keys(type);

        if (
          valueKeys.length === typeKeys.length &&
          valueKeys.every((k) => typeKeys.includes(k))
        ) {
          return (
            <>
              {valueKeys.map((key) => (
                <TableRow key={key}>
                  <TypeCell>{type[key]}</TypeCell>
                  <TableCell>
                    <strong>{key}</strong>
                  </TableCell>
                  <TableCell>{renderParamValue(param.value[key])}</TableCell>
                </TableRow>
              ))}
            </>
          );
        }
      } else {
        return (
          <>
            {valueKeys.map((key, index) => (
              <TableRow key={key}>
                {index === 0 && (
                  <TypeCell rowSpan={valueKeys.length}>{type}</TypeCell>
                )}
                <TableCell>
                  <strong>{key}</strong>
                </TableCell>
                <TableCell>{renderParamValue(param.value[key])}</TableCell>
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
      <TypeCell>{param.type}</TypeCell>
      <TableCell colSpan={2}>{renderParamValue(param.value)}</TableCell>
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
