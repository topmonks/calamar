import { Button, FormGroup, TextField } from "@mui/material";
import React from "react";
import { getExtrinsics } from "../services/extrinsicsService";
import { getBlocks } from "../services/blocksService";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";

function isNumber(str: string) {
  return /^\+?(0|[1-9]\d*)$/.test(str);
}

function SearchInput() {
  const [search, setSearch] = React.useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
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

  const StyledTextField = styled(TextField)`
    max-width: 700px;
    background-color: #f5f5f5;
    .MuiInputBase-root {
      border-radius: 8px 0px 0px 8px !important;
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
    width: 200px !important;
  `;

  return (
    <FormGroup row style={{ justifyContent: "center" }}>
      <StyledTextField
        fullWidth
        id="search"
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Extrinsic hash / account address / block hash / block height / section / method / name"
        value={search}
        variant="outlined"
      />
      <StyledButton
        className="calamar-button"
        disableElevation
        onClick={handleSubmit}
        variant="contained"
      >
        Search
      </StyledButton>
    </FormGroup>
  );
}

export default SearchInput;
