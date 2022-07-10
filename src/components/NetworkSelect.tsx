import React, { useEffect } from "react";
import { MenuItem, Select, SelectProps } from "@mui/material";
import styled from "@emotion/styled";
import cx from "classnames";

import archivesJSON from "../archives.json";
import { useNavigate } from "react-router-dom";

const StyledSelect = styled(Select)`
  border-radius: 8px !important;
  overflow: hidden;

  background-color: #61dafb !important;
  border-color: #14a1c0;
  text-transform: capitalize !important;

  & .MuiOutlinedInput-root {
    &.Mui-focused fieldset {
      border-color: #14a1c0;
    }
  }
`;

type NetworkSelectProps = SelectProps;

const NetworkSelect = (props: NetworkSelectProps) => {
  const archives = archivesJSON.archives || [];
  const [archive, setArchive] = React.useState(archives[0]);

  const navigate = useNavigate();

  useEffect(() => {
    let network = localStorage.getItem("network");
    if (!network) {
      network = archive.network;
      localStorage.setItem("network", network);
    }

    setArchive(archives.find((a) => a.network === network) || archives[0]);
  }, []);

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
    <StyledSelect
      {...props}
      className={cx("calamar-button", props.className)}
      onChange={handleArchiveChange}
      //size="small"
      value={archive.network}
    >
      {archives.map((archive: any) => (
        <MenuItem key={archive.network} value={archive.network}>
          {archive.network}
        </MenuItem>
      ))}
    </StyledSelect>
  );
};

export default NetworkSelect;
