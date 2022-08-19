import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";

import { ReactComponent as Logo } from "../assets/calamar-logo-export-05.svg";
import Background from "../assets/main-screen-bgr.svg";

import NetworkSelect from "../components/NetworkSelect";
import SearchInput from "../components/SearchInput";

const StyledSearchBox = styled.div`
  margin: auto;
  max-width: 1000px;
  padding-left: 16px;
  padding-right: 16px;
  text-align: center;

  @media (min-width: 900px) {
    display: flex;
    justify-content: center;
  }
`;

const StyledNetworkSelect = styled(NetworkSelect)`
  height: auto;
  font-size: 16px !important;
  margin-bottom: 16px;

  .MuiSelect-select {
    padding: 8.5px 14px;
  }

  @media (min-width: 900px) {
    height: 56px;
    border-radius: 8px 0px 0px 8px !important;
  }
`;

const StyledSearchInput = styled(SearchInput)`
  @media (min-width: 900px) {
    flex: 1 1 auto;

    .MuiTextField-root {
      .MuiInputBase-root {
        border-radius: 0px !important;
      }
    }
  }
`;

function HomePage() {
  const [network, setNetwork] = useState<string | undefined>();

  useEffect(() => {
    let network = localStorage.getItem("network");
    network && setNetwork(network);
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundPosition: "center bottom",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundImage: `url(${Background})`,
        margin: 0,
      }}
    >
      <Logo
        style={{
          width: "500px",
          margin: "auto",
          display: "block",
          maxWidth: "100%",
        }}
      />
      <StyledSearchBox>
        <StyledNetworkSelect onChange={setNetwork} value={network} />
        <StyledSearchInput network={network} />
      </StyledSearchBox>
      <div style={{ margin: "auto", width: "fit-content", marginTop: 24 }}>
        <Link to={`/${network}/latest-extrinsics`}>Show latest extrinsics</Link>
      </div>
    </div>
  );
}

export default HomePage;
