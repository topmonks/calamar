/** @jsxImportSource @emotion/react */
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { css, Theme } from "@emotion/react";

import { ReactComponent as Logo } from "../assets/calamar-logo-export-05.svg";
import Background from "../assets/main-screen-bgr.svg";

import { Link } from "../components/Link";
import NetworkSelect from "../components/NetworkSelect";
import SearchInput from "../components/SearchInput";

import Telegram from "../assets/telegram-icon.png";
import GitHub from "../assets/github-icon.png";
import Email from "../assets/email-icon.png";

const containerStyle = css`
  width: 100vw;
  height: 100vh;
  background-position: center bottom;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url(${Background});
  margin: 0;
  display: flex;
  flex-direction: column;
`;

const logoStyle = css`
  width: 500px;
  margin: auto;
  display: block;
  max-width: 100%;
`;

const searchBoxStyle = (theme: Theme) => css`
  display: flex;
  margin: auto;
  max-width: 1000px;
  padding-left: 16px;
  padding-right: 16px;
  text-align: center;
  justify-content: center;
`;

const networkSelectStyle = (theme: Theme) => css`
  margin-bottom: 16px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;

  & .MuiInputBase-input {
    //color: white;
    //background-color: #61dafb;
    font-size: 16px;
    font-weight: 600;

    &.MuiSelect-select {
      padding: 16px 24px;
    }
  }

  & .MuiOutlinedInput-notchedOutline,
  &:hover .MuiOutlinedInput-notchedOutline,
  &.Mui-focused .MuiOutlinedInput-notchedOutline {
    //border-color: ${theme.palette.secondary.main};
    border-color: #c4cdd5;
    border-right: none;
  }

  &::after {
    content: "";
    display: block;
    width: 1px;
    height: 24px;
    margin-left: -1px;
    background-color: #c4cdd5;
    position: relative;
    z-index: 10;
  }
`;

const searchInputStyle = (variant: string) => (theme: Theme) =>
	css`
    flex: 1 1 auto;

    .MuiInputBase-root {
      .MuiInputBase-input,
      .MuiSelect-select {
        padding: 16px 24px;
      }
    }

    ${["3", "4"].includes(variant) &&
    css`
      .MuiListItemIcon-root {
        min-width: 36px !important;

        img {
          width: 24px !important;
          height: 24px !important;
        }
      }

      .MuiSelect-select {
        &::before,
        &::after {
          height: 38px !important;
        }
      }
    `}

    ${theme.breakpoints.up("md")} {
      .MuiButton-root {
        padding-left: 52px;
        padding-right: 52px;
      }
    }
  `;

const iconStyle = css`
  filter: sepia(300%) hue-rotate(150deg) saturate(450%) brightness(0.9);
  scale: 0.8;
`;

function HomePage() {
	const [network, setNetwork] = useState<string | undefined>();

	// TODO this is temporary until resolved
	const [qs] = useSearchParams();
	const searchInputVariant = qs.get("search-input-variant") || "1";

	return (
		<div css={containerStyle}>
			<div style={{ display: "flex", justifyContent: "end", gap: "2rem" }}>
				<a href="t.me/calamar_explorer">
					<img src={Telegram} alt="Telegram" css={iconStyle} />
				</a>
				<a href="t.me/calamar_explorer">
					<img src={GitHub} alt="GitHub" css={iconStyle} />
				</a>
				<a href="t.me/calamar_explorer">
					<img src={Email} alt="Email" css={iconStyle} />
				</a>
			</div>
			<div>
				<Logo css={logoStyle} />
				<div css={searchBoxStyle}>
					<SearchInput
						css={searchInputStyle(searchInputVariant)}
						onNetworkChange={setNetwork}
						persistNetwork
					/>
				</div>
				<div style={{ margin: "auto", width: "fit-content", marginTop: 24 }}>
					<Link to={`/${network}/latest-extrinsics`}>
            Show latest extrinsics
					</Link>
				</div>
			</div>
		</div>
	);
}

export default HomePage;
