import React from "react";
import SearchInput from "../components/SearchInput";
import { ReactComponent as Logo } from "../assets/calamar-logo-export-05.svg";
import Background from "../assets/main-screen-bgr.svg";
import { Link } from "react-router-dom";

function HomePage() {
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
      <div
        style={{
          margin: "auto",
          maxWidth: 1000,
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        <SearchInput showNetworkSelect />
      </div>
      <div style={{ margin: "auto", width: "fit-content", marginTop: 24 }}>
        <Link to="/latest-extrinsics">Show latest extrinsics</Link>
      </div>
    </div>
  );
}

export default HomePage;
