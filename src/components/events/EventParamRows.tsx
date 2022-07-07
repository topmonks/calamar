import React from "react";
import { TableCell, TableRow } from "@mui/material";
import styled from "@emotion/styled";

import { tryJsonParse } from "../../utils/tryJsonParse";

import EventParamValue from "./EventParamValue";
import { EventParam } from "../../model/eventParam";

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

export type EventParamRowsProps = {
  param: EventParam;
  index: number;
};

function EventParamRows(props: EventParamRowsProps) {
  const { index, param } = props;

  return (
    <TableRow>
      <TableCell>{index}</TableCell>
      <TableCell>
        <EventParamValue value={param} />
      </TableCell>
    </TableRow>
  );
}

export default EventParamRows;
