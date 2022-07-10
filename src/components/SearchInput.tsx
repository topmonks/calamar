import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Button,
  FormGroup,
  Grid,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import styled from "@emotion/styled";
import archivesJSON from "../archives.json";
import NetworkSelect from "./NetworkSelect";

const StyledTextField = styled(TextField)`
  max-width: 720px !important;
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

const StyledNetworkSelect = styled(NetworkSelect)`
  border-radius: 8px 0px 0px 8px !important;

  + .MuiTextField-root {
    .MuiInputBase-root {
      border-radius: 0px !important;
    }
  }
`;

export type SearchInputProps = {
  showNetworkSelect?: boolean;
};

function SearchInput(props: SearchInputProps) {
  const { showNetworkSelect } = props;

  const [qs] = useSearchParams();
  const query = qs.get("query");
  console.log(qs, query);

  const [search, setSearch] = React.useState<string>(query || "");

  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    navigate(`/search?query=${search}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormGroup
        row
        style={{
          flexDirection: "row",
          justifyContent: "center",
          flexWrap: "nowrap",
        }}
      >
        {showNetworkSelect && <StyledNetworkSelect />}
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
