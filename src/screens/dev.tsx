import { Grid } from "@mui/material";
import React from "react";
import OldEventsTable from "../components/events/OldEventsTable";
import BlocksMiniTable from "../components/blocks/BlocksMiniTable";
import SearchInput from "../components/SearchInput";
import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";

function Dev() {
  return (
    <Grid container spacing={2} style={{ padding: "64px 64px" }}>
      <Grid item xs={12}>
        <ExtrinsicsTable />
      </Grid>
      <Grid item xs={12}>
        <OldEventsTable />
      </Grid>
    </Grid>
  );
}

export default Dev;
