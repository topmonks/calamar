/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const StatStyle = css`
    min-width: 100px;
    width: 100%;
    height: 64px;
    display: flex;
`;

const StatIconStyle = css`
    width: 44px;
    height: 44px;
    margin-right: 10px;
    padding: 10px;
`;

const StatTitleStyle = css`
    font-weight: 900;
    margin-top: auto;
`;

const StatValueStyle = css`
    font-weight: 500;
    height: 32px;
`;

export type StatItemProps = {
	title: string;
	icon?: string;
	value?: string | number;
};

export function StatItem (props: StatItemProps) {
	const {
		title,
		value,
		icon,
	} = props;
    
	return (
		<div css={StatStyle}>
			<img css={StatIconStyle} src={icon} />
			<div style={{display: "flex", flexDirection: "column"}}>
				<div css={StatTitleStyle}>{title}</div>
				<div css={StatValueStyle}>{value}</div>
			</div>
		</div>
	);
}