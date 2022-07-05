import React from "react";
import { Paper, Table, TableBody, TableContainer } from "@mui/material";
import styled from "@emotion/styled";

import EventParamRows from "./EventParamRows";

const ParamsTable = styled(Table)({
  backgroundColor: "rgba(0, 0, 0, 0.05)",
});

function EventParamsTable2({
  params,
}: {
  params: {
    name: string;
    type: string;
    value: any;
  }[];
}) {
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

export default EventParamsTable2;
