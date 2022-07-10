import React, { ReactComponentElement, ReactNode } from "react";
import Background from "../assets/detail-page-bgr.svg";
import { ReactComponent as Logo } from "../assets/calamar-logo-export-02.svg";
import SearchInput from "./SearchInput";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import NetworkSelect from "./NetworkSelect";

const StyledTopBar = styled.div`
  position: fixed;
  top: 0;
  padding-left: 32px;
  padding-right: 32px;
  padding-top: 12px;
  padding-bottom: 16px;
  width: 100vw;
  min-height: 130px;
  box-sizing: border-box;
  background-color: white;

  > .top-bar-content {
    max-width: 1500px;
    margin: auto;
    display: flex;
    flex-direction: column;

    > .top-bar-first-row,
    > .top-bar-second-row {
      flex: 1 1 auto;
    }

    > .top-bar-first-row {
      display: flex;
      align-items: center;
    }
  }

  .logo {
    margin-right: auto;

    > svg {
      width: 160px;
    }
  }

  @media (min-width: 900px) {
    padding-top: 24px;
    padding-bottom: 0;

    > .top-bar-content {
      flex-direction: row;
      align-items: center;

      > .top-bar-second-row {
        .MuiTextField-root {
          .MuiInputBase-root {
            border-radius: 0px !important;
          }
        }
      }
    }

    .logo {
      > svg {
        width: 250px;
      }
    }
  }
`;

const StyledContent = styled.div`
  position: absolute;
  top: 170px;
  padding: 0 32px;
  width: 100vw;
  box-sizing: border-box;
`;

const StyledNetworkSelect = styled(NetworkSelect)`
  height: auto;
  font-size: 16px !important;

  .MuiSelect-select {
    padding: 8.5px 14px;
  }

  @media (min-width: 900px) {
    height: 56px;
    border-radius: 8px 0px 0px 8px !important;
  }
`;

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
      <StyledContent>
        <div style={{ maxWidth: "1500px", margin: "auto" }}>{children}</div>
      </StyledContent>
      <StyledTopBar>
        <div className="top-bar-content">
          <div className="top-bar-first-row">
            <Link className="logo" to="/">
              <Logo />
            </Link>
            <StyledNetworkSelect />
          </div>
          <div className="top-bar-second-row">
            <SearchInput />
          </div>
        </div>
      </StyledTopBar>
    </>
  );
}

export default ResultLayout;
