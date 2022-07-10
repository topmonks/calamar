import React from "react";
import { CircularProgress } from "@mui/material";
import styled from "@emotion/styled";

const StyledCircularProgress = styled(CircularProgress)`
  color: #9af0f7;
`;

const Spinner = () => {
  return <StyledCircularProgress size={54} thickness={6} />;
};

export default Spinner;
