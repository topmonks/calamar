import { Button, Grid, TextField } from "@mui/material";
import React from "react";
import { getExtrinsics } from "../services/extrinsicsService";
import { getBlocks } from "../services/blocksService";

function SearchInput() {
  const [search, setSearch] = React.useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search.startsWith("0x")) {
      const extrinsic = await getExtrinsics(1, 0, { hash: search }, ["id"]);
      if (!extrinsic.length) {
        const block = await getBlocks(1, 0, { hash: search });
        console.log(block);
      } else {
        // redirect to page with extrinsic details
        window.location.href = `/calamar/extrinsic/${search}`;
      }
    } else {
      // other search
    }

    const extrinsic = await getExtrinsics(1, 0, { hash: search });
    console.log(extrinsic);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs>
              <TextField
                fullWidth
                id="search"
                label="Extrinsic hash / account address / block hash / block height"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                variant="outlined"
              />
            </Grid>
            <Grid item xs="auto">
              <Button color="primary" variant="contained">
                Search
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
}

export default SearchInput;
