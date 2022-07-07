import { Button, Grid, TextField } from "@mui/material";
import React from "react";
import { getExtrinsics } from "../services/extrinsicsService";
import { getBlocks } from "../services/blocksService";
import { useNavigate } from "react-router-dom";
import { getEvents } from "../services/eventsService";

function isNumber(str: string) {
  return /^\+?(0|[1-9]\d*)$/.test(str);
}

function SearchInput() {
  const [search, setSearch] = React.useState<string>("");
  const [notFound, setNotFound] = React.useState<string | false>(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setNotFound(false);

    if (search.startsWith("0x")) {
      const extrinsics = await getExtrinsics(
        1,
        0,
        { hash: { _eq: search } },
        {},
        ["id"]
      );

      if (extrinsics.length > 0) {
        return navigate(`/extrinsic/${extrinsics[0].id}`);
      }

      const blocks = await getBlocks(1, 0, { hash: { _eq: search } });
      if (blocks.length > 0) {
        return navigate(`/block/${blocks[0].id}`);
      }

      setNotFound("No extrinsic nor block found.");
    }

    if (isNumber(search)) {
      const blocks = await getBlocks(
        1,
        0,
        { height: { _eq: parseInt(search) } },
        ["id"]
      );

      if (blocks.length > 0) {
        return navigate(`/block/${blocks[0].id}`);
      }

      setNotFound("No block found.");
    }

    let extrinsics = await getExtrinsics(
      1,
      0,
      { signer: { _eq: search } },
      {},
      ["id"]
    );

    if (extrinsics.length > 0) {
      return navigate(`/account/${search}`);
    }

    extrinsics = await getExtrinsics(
      1,
      0,
      {
        name: { _eq: search },
      },
      {},
      ["id"]
    );

    const events = await getEvents(1, 0, {
      name: { _eq: search },
    });

    if (extrinsics.length > 0 || events.length > 0) {
      return navigate(`/extrinsics-by-name/${search}`);
    }
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
              <Button color="primary" type="submit" variant="contained">
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
