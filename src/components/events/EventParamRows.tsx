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

const EventParamTableCell = styled(TableCell)`
  padding: 16px 24px !important;
`;

function EventParamRows(props: EventParamRowsProps) {
  const { index, param } = props;

  return (
    <TableRow>
      <EventParamTableCell>{index}</EventParamTableCell>
      <EventParamTableCell>
        <EventParamValue value={param} />
      </EventParamTableCell>
    </TableRow>
  );
}

export default EventParamRows;
