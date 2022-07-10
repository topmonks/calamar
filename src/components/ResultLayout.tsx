import React, { ReactComponentElement, ReactNode } from "react";
import Background from "../assets/detail-page-bgr.svg";
import { ReactComponent as Logo } from "../assets/calamar-logo-export-02.svg";
import SearchInput from "./SearchInput";
import { Link } from "react-router-dom";

function ResultLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          backgroundPosition: "center bottom",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundImage: `url(${Background})`,
          margin: 0,
          position: "fixed",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 170,
          paddingLeft: 32,
          width: "calc(100vw - 64px)",
        }}
      >
        <div style={{ maxWidth: "1500px", margin: "auto" }}>{children}</div>
      </div>
      <div
        style={{
          position: "fixed",
          top: 0,
          paddingLeft: 32,
          paddingTop: 24,
          width: "calc(100vw - 64px)",
          backgroundColor: "white",
        }}
      >
        <div style={{ maxWidth: "1500px", margin: "auto" }}>
          <Link to="/">
            <Logo
              style={{ width: "250px", float: "left", cursor: "pointer" }}
            />
          </Link>
          <div style={{ width: "fit-content", float: "right" }}>
            <div className="vertical-center" style={{ height: 100 }}>
              <SearchInput />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResultLayout;
