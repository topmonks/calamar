import { Grid } from "@mui/material";
import React from "react";
import EventsTable from "../components/events/EventsTable";
import ExtrinsicsMiniTable from "../components/extrinsics/ExtrinsicsMiniTable";
import BlocksMiniTable from "../components/blocks/BlocksMiniTable";

function Dashboard() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <BlocksMiniTable />
      </Grid>
      <Grid item xs={6}>
        <ExtrinsicsMiniTable />
      </Grid>
      <Grid item xs={12}>
        <EventsTable />
      </Grid>
    </Grid>
  );
}

export default Dashboard;
