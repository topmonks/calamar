import React from "react";
import { TableCell, TableRow } from "@mui/material";
import styled from "@emotion/styled";

import { tryJsonParse } from "../../utils/tryJsonParse";

import EventParamValue from "./EventParamValue";

const ParamNameCell = styled(TableCell)({
  maxWidth: 180,
});

const ParamName = styled.span({
  fontWeight: "bold",
  wordBreak: "break-all",
});

const ParamType = styled.span({
  opacity: 0.75,
  wordBreak: "break-all",
});

function EventParamRows(props: { index: number; param: any }) {
  const { index, param } = props;

  const type = tryJsonParse(param.type);

  if (typeof type === "object" && typeof param.value === "object") {
    const typeKeys = Object.keys(type);
    const valueKeys = Object.keys(param.value);

    valueKeys.sort();

    if (
      valueKeys.length === typeKeys.length &&
      valueKeys.every((k) => typeKeys.includes(k))
    ) {
      return (
        <>
          {valueKeys.map((key, i) => (
            <TableRow key={key}>
              {i === 0 && (
                <TableCell rowSpan={valueKeys.length}>{index}</TableCell>
              )}
              <ParamNameCell>
                <ParamName>{key}</ParamName>
                <br />
                <ParamType>{type[key]}</ParamType>
              </ParamNameCell>
              <TableCell>
                <EventParamValue value={param.value[key]} />
              </TableCell>
            </TableRow>
          ))}
        </>
      );
    }
  }

  return (
    <TableRow>
      <TableCell>{index}</TableCell>
      <ParamNameCell>
        <ParamType>{type}</ParamType>
      </ParamNameCell>
      <TableCell>
        <EventParamValue value={param.value} />
      </TableCell>
    </TableRow>
  );
}

export default EventParamRows;
