import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, FormGroup, Grid, TextField } from "@mui/material";
import styled from "@emotion/styled";

import { getExtrinsicById, getExtrinsics } from "../services/extrinsicsService";
import { getBlockById, getBlocks } from "../services/blocksService";
import { getEvents } from "../services/eventsService";

const StyledTextField = styled(TextField)`
  min-width: 800px !important;
  background-color: #f5f5f5;

  .MuiInputBase-root {
    font-family: "Open Sans", sans-serif !important;
    border-radius: 8px 0px 0px 8px !important;
  }
  & label.Mui-focused {
    color: #d8545c;
  }
  & .MuiOutlinedInput-root {
    &.Mui-focused fieldset {
      border-color: #d8545c;
    }
  }
`;

const StyledButton = styled(Button)`
  text-transform: none !important;
  font-family: "Open Sans" !important;
  font-style: normal !important;
  font-weight: 700 !important;
  font-size: 20px !important;
  line-height: 27px !important;
  background-color: #ff646d !important;
  border: 1px solid #d8545c !important;
  color: #ffffff !important;
  border-radius: 0px 8px 8px 0px !important;
  width: 150px !important;
  height: 56px;
`;

function isNumber(str: string) {
  return /^\+?(0|[1-9]\d*)$/.test(str);
}

function SearchInput() {
  const [search, setSearch] = React.useState<string>("");
  const [, setNotFound] = React.useState<string | false>(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setNotFound(false);

    if (search.startsWith("0x")) {
      const extrinsics = await getExtrinsics(1, 0, { hash_eq: search });

      if (extrinsics.length > 0) {
        return navigate(`/extrinsic/${extrinsics[0].id}`);
      }

      const blocks = await getBlocks(1, 0, { hash_eq: search });
      if (blocks.length > 0) {
        return navigate(`/block/${blocks[0].id}`);
      }

      setNotFound("No extrinsic nor block found.");
    }

    if (isNumber(search)) {
      const blocks = await getBlocks(1, 0, { height_eq: parseInt(search) }, [
        "id",
      ]);

      if (blocks.length > 0) {
        return navigate(`/block/${blocks[0].id}`);
      }

      setNotFound("No block found.");
    }

    let extrinsics = await getExtrinsics(
      1,
      0,
      { signature_jsonContains: `{\\"address\\": \\"${search}\\"}` },
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
        call: { name_eq: search },
      },
      {},
      ["id"]
    );

    const events = await getEvents(1, 0, {
      name_eq: search,
    });

    if (extrinsics.length > 0 || events.length > 0) {
      return navigate(`/extrinsics-by-name/${search}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "fit-content" }}>
      <FormGroup
        row
        style={{
          justifyContent: "center",
        }}
      >
        <Grid container>
          <Grid item xs="auto">
            <StyledTextField
              fullWidth
              id="search"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Extrinsic hash / account address / block hash / block height / extrinsic name / event name"
              value={search}
              variant="outlined"
            />
          </Grid>
          <Grid item xs="auto">
            <StyledButton
              className="calamar-button"
              disableElevation
              onClick={handleSubmit}
              type="submit"
              variant="contained"
            >
              Search
            </StyledButton>
          </Grid>
        </Grid>
      </FormGroup>
    </form>
  );
}

export default SearchInput;
