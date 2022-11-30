/** @jsxImportSource @emotion/react */
import { Email, GitHub, Telegram } from "@mui/icons-material";
import { alpha } from "@mui/material";
import { css, Theme } from "@emotion/react";
import { HTMLAttributes } from "react";

const footerStyle = css`
	box-sizing: border-box;
	width: 100%;
	padding: 32px;
`;

const contentStyle = (theme: Theme) => css`
	display: flex;
	box-sizing: border-box;
	justify-content: space-between;
	margin: 0 auto;
	padding: 0 16px;
	align-items: center;
	gap: 52px;

	width: 100%;

	z-index: 100;

	font-size: 15px;
	color: ${theme.palette.secondary.dark};

	a {
		color: inherit;
		text-decoration: none;
	}

	${theme.breakpoints.down("md")} {
		flex-direction: column-reverse;
		gap: 16px;
	}
`;

const creditsStyle = css`
	display: flex;
	align-items: center;

	> div {
		text-align: center;
	}

	a {
		font-weight: 600;
	}
`;

const separatorStyle = css`
	display: inline-block;
	width: 1px;
	height: 10px;
	background-color: currentColor;
	margin: 0 16px;
	margin-top: 2px;
	opacity: .75;
`;

const linksStyle = css`
	display: flex;
	padding: 0 8px;
	width: fit-content;
	align-items: center;
	gap: 2rem;
	z-index: 10;
`;

const iconStyle = (theme: Theme) => css`
	display: block;
	font-size: 1.25em;
	color: ${alpha(theme.palette.secondary.dark, .8)};
`;

export const Footer = (props: HTMLAttributes<HTMLDivElement>) => {
	return (
		<div css={footerStyle} {...props}>
			<div css={contentStyle}>
				<div css={creditsStyle}>
					<div>Created by <a href="https://topmonks.com">TopMonks</a></div>
					<div css={separatorStyle}></div>
					<div>Powered by <a href="https://subsquid.io">Subsquid</a></div>
				</div>
				<div css={linksStyle}>
					<a href="https://docs.calamar.app">Docs</a>
					<a href="https://t.me/calamar_explorer">
						<Telegram css={iconStyle} />
					</a>
					<a href="https://github.com/topmonks/calamar">
						<GitHub css={iconStyle} />
					</a>
					<a href="mailto:calamar@topmonks.com">
						<Email css={iconStyle} />
					</a>
				</div>
			</div>
		</div>
	);
};
