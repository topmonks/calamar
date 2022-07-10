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
import styled from "@emotion/styled";
import archivesJSON from "../archives.json";

const StyledTextField = styled(TextField)`
  min-width: 720px !important;
  background-color: #f5f5f5;

  .MuiInputBase-root {
    font-family: "Open Sans", sans-serif !important;
    border-radius: 0px !important;
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
  width: 150px !important;
  border: 1px solid #d8545c !important;
  background-color: #ff646d !important;
`;

const StyledSelect = styled(Select)`
  border-radius: 8px 0px 0px 8px !important;
  background-color: #61dafb !important;
  border-color: #14a1c0;
  text-transform: capitalize !important;
  & .MuiOutlinedInput-root {
    &.Mui-focused fieldset {
      border-color: #14a1c0;
    }
  }
`;

function SearchInput() {
  const [qs] = useSearchParams();
  const query = qs.get("query");
  console.log(qs, query);

  const archives = archivesJSON.archives || [];
  const [archive, setArchive] = React.useState(archives[0]);

  const [search, setSearch] = React.useState<string>(query || "");

  const navigate = useNavigate();

  useEffect(() => {
    let network = localStorage.getItem("network");
    if (!network) {
      network = archive.network;
      localStorage.setItem("network", network);
    }

    setArchive(archives.find((a) => a.network === network) || archives[0]);
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    navigate(`/search?query=${search}`);
  };

  const handleArchiveChange = (e: any) => {
    const archive = archives.find(
      (archive: any) => archive.network === e.target.value
    );
    if (archive) {
      setArchive(archive);
      localStorage.setItem("network", e.target.value);
      navigate("/");
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
            <StyledSelect
              className="calamar-button"
              onChange={handleArchiveChange}
              value={archive.network}
            >
              {archives.map((archive: any) => (
                <MenuItem key={archive.network} value={archive.network}>
                  {archive.network}
                </MenuItem>
              ))}
            </StyledSelect>
          </Grid>
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
