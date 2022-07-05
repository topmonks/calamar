import React from "react";
import { Paper, Table, TableBody, TableContainer } from "@mui/material";
import styled from "@emotion/styled";

import { EventParam } from "../../model/eventParam";

import EventParamRows from "./EventParamRows";

const ParamsTable = styled(Table)({
  backgroundColor: "rgba(0, 0, 0, 0.05)",
});

export type EventParamsTableProps = {
  params: EventParam[];
};

function EventParamsTable(props: EventParamsTableProps) {
  const { params } = props;

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      style={{ maxWidth: "100%", width: "fit-content" }}
    >
      <ParamsTable size="small">
        <TableBody>
          {params.map((param, index) => (
            <EventParamRows index={index} key={index} param={param} />
          ))}
        </TableBody>
      </ParamsTable>
    </TableContainer>
  );
}

export default EventParamsTable;
