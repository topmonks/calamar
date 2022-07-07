import React, { useMemo } from "react";
import { Paper, Table, TableBody, TableContainer } from "@mui/material";
import styled from "@emotion/styled";

import { EventParam } from "../../model/eventParam";

import EventParamRows from "./EventParamRows";

const ParamsTable = styled(Table)({
  backgroundColor: "rgba(0, 0, 0, 0.05)",
});

export type EventParamsTableProps = {
  args: any;
};

function EventParamsTable(props: EventParamsTableProps) {
  const { args } = props;

  console.log(args);
  const argsArray: any[] = useMemo(
    () => (Array.isArray(args) ? args : [args]),
    [args]
  );

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      style={{ maxWidth: "100%", width: "fit-content" }}
    >
      <ParamsTable size="small">
        <TableBody>
          {argsArray.map((arg, index) => (
            <EventParamRows index={index} key={index} param={arg} />
          ))}
        </TableBody>
      </ParamsTable>
    </TableContainer>
  );
}

export default EventParamsTable;
