import React, { FormHTMLAttributes, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, FormGroup, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import styled from "@emotion/styled";
import NetworkSelect from "./NetworkSelect";

const StyledTextField = styled(TextField)`
  background-color: #f5f5f5;

  .MuiInputBase-root {
    font-family: "Open Sans", sans-serif !important;
    border-radius: 8px 0 0 8px !important;
  }

  & label.Mui-focused {
    color: #14a1c0;
  }
  & .MuiOutlinedInput-root {
    &.Mui-focused fieldset {
      border-color: #14a1c0;
    }
  }
`;

const StyledButton = styled(Button)`
  border-radius: 0px 8px 8px 0px !important;
  border: 1px solid #d8545c !important;
  background-color: #ff646d !important;

  .text {
    display: none;
  }

  .MuiButton-startIcon {
    margin: 0;
  }

  @media (min-width: 720px) {
    width: 150px !important;

    .text {
      display: inline-block;
    }

    .MuiButton-startIcon {
      display: none;
    }
  }
`;

export type SearchInputProps = FormHTMLAttributes<HTMLFormElement> & {
  network: string | undefined;
};

function SearchInput(props: SearchInputProps) {
  const { network } = props;

  const [qs] = useSearchParams();
  const query = qs.get("query");
  console.log(qs, query);

  const [search, setSearch] = React.useState<string>(query || "");

  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (e: any) => {
      if (!network) {
        return;
      }

      e.preventDefault();
      localStorage.setItem("network", network);
      navigate(`/${network}/search?query=${search}`);
    },
    [navigate, network, search]
  );

  return (
    <form {...props} onSubmit={handleSubmit}>
      <FormGroup
        row
        style={{
          flexDirection: "row",
          justifyContent: "center",
          flexWrap: "nowrap",
        }}
      >
        <StyledTextField
          fullWidth
          id="search"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Extrinsic hash / account address / block hash / block height / extrinsic name / event name"
          value={search}
          variant="outlined"
        />
        <StyledButton
          className="calamar-button"
          disableElevation
          onClick={handleSubmit}
          startIcon={<SearchIcon />}
          type="submit"
          variant="contained"
        >
          <span className="text">Search</span>
        </StyledButton>
      </FormGroup>
    </form>
  );
}

export default SearchInput;
