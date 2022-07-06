import { Button, Grid, TextField } from "@mui/material";
import React from "react";
import { getExtrinsics } from "../services/extrinsicsService";
import { getBlocks } from "../services/blocksService";
import { useNavigate } from "react-router-dom";

function isNumber(str: string) {
  return /^\+?(0|[1-9]\d*)$/.test(str);
}

function SearchInput() {
  const [search, setSearch] = React.useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (search.startsWith("0x")) {
      const extrinsics = await getExtrinsics(
        1,
        0,
        { hash: { _eq: search } },
        {},
        ["id"]
      );
      if (extrinsics.length > 0) {
        navigate(`/extrinsic/${extrinsics[0].id}`);
      } else {
        const blocks = await getBlocks(1, 0, { hash: { _eq: search } });
        if (blocks.length > 0) {
          navigate(`/block/${blocks[0].id}`);
        } else {
          alert("No block or extrinsic found");
        }
      }
    } else if (isNumber(search)) {
      const blocks = await getBlocks(
        1,
        0,
        { height: { _eq: parseInt(search) } },
        ["id"]
      );
      console.log("BBH", blocks);
      if (blocks.length > 0) {
        navigate(`/block/${blocks[0].id}`);
      } else {
        alert("No block found");
      }
    } else {
      const extrinsics = await getExtrinsics(
        1,
        0,
        { signer: { _eq: search } },
        {},
        ["id"]
      );
      if (extrinsics.length > 0) {
        navigate(`/account/${search}`);
      } else {
        navigate(`/extrinsics/${search}`);
      }
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
