import { Grid } from "@mui/material";
import React from "react";
import SearchInput from "../components/SearchInput";
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "../assets/calamar-logo-export-05.svg";

function Home() {
  return (
    <div
      className="home-page"
      style={{
        width: "100vw",
        height: "100vh",
        backgroundPosition: "center bottom",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        margin: 0,
      }}
    >
      <Logo style={{ width: "500px", margin: "auto", display: "block" }} />
      <SearchInput />
      <Link to="/dev">dev</Link>
    </div>
  );
}

export default Home;
