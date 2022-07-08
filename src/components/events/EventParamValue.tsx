import React from "react";
import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import styled from "@emotion/styled";

const ValueTable = styled(Table)`
  margin: -6px -16px;
  width: auto;
  word-break: initial;
  td:first-of-type {
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
  }

  tr:last-child {
    td {
      border-bottom: none;
    }
  }
`;

const ParamNameCell = styled(TableCell)({
  width: 150,
});

const ParamName = styled.div({
  fontWeight: "bold",
  wordBreak: "break-all",
});

const ParamValue = styled.div({
  wordBreak: "break-all",
  maxWidth: 550,
});

export type EventParamValueProps = {
  value: any;
};

function EventParamValue(props: EventParamValueProps) {
  const { value } = props;

  if (Array.isArray(value)) {
    return (
      <ValueTable size="small">
        <TableBody>
          {value.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{index}</TableCell>
              <TableCell>
                <EventParamValue value={item} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </ValueTable>
    );
  } else if (typeof value === "object") {
    const keys = Object.keys(value);
    keys.sort();

    return (
      <ValueTable size="small">
        <TableBody>
          {keys.map((key) => (
            <TableRow key={key}>
              <ParamNameCell>
                <ParamName>{key}</ParamName>
              </ParamNameCell>
              <TableCell>
                <EventParamValue value={value[key]} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </ValueTable>
    );
  } else if (typeof value === "boolean") {
    return <span>{value ? "true" : "false"}</span>;
  }

  return <ParamValue>{value}</ParamValue>;
}

export default EventParamValue;
