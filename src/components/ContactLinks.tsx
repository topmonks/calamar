/** @jsxImportSource @emotion/react */
import Telegram from "../assets/telegram-icon-blue.png";
import GitHub from "../assets/github-icon-blue.png";
import Email from "../assets/email-icon-blue.png";
import {css} from "@emotion/react";

const iconStyle = css`
	height: 1.5rem;
`;

export default function ContactLinks() {
	return <div style={{ display: "flex", width: "fit-content", gap: "2rem", margin: "1rem 2rem", zIndex: "10" }}>
		<a href="https://t.me/calamar_explorer" target="_blank" rel="noreferrer">
			<img src={Telegram} alt="Telegram" css={iconStyle} />
		</a>
		<a href="https://github.com/topmonks/calamar" target="_blank" rel="noreferrer">
			<img src={GitHub} alt="GitHub" css={iconStyle} />
		</a>
		<a href="mailto:calamar@topmonks.com" target="_blank" rel="noreferrer">
			<img src={Email} alt="Email" css={iconStyle} />
		</a>
	</div>;
}