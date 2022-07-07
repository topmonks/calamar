import React from "react";
import SearchInput from "../components/SearchInput";
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "../assets/calamar-logo-export-05.svg";
import Background from "../assets/main-screen-bgr.svg";

function Home() {
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
      <Logo style={{ width: "500px", margin: "auto", display: "block" }} />
      <div style={{ margin: "auto", width: "fit-content" }}>
        <SearchInput />
      </div>
    </div>
  );
}

export default Home;
