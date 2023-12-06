/** @jsxImportSource @emotion/react */
import { IconButton, Tooltip } from "@mui/material";
import { AutoStories } from "@mui/icons-material";
import { css } from "@emotion/react";

import { Link } from "../Link";

import { RuntimeMetadataDescription } from "./RuntimeMetadataDescription";

const titleStyle = css`
	font-weight: 700;
	font-size: 16px;
	margin: 0;
`;

const viewMoreStyle = css`
	margin-top: 16px;
	opacity: 0.5;
	text-align: center;
`;

export interface RuntimeMetadataButtonProps {
	title: string;
	description: string;
	link: string;
}

export const RuntimeMetadataButton = (props: RuntimeMetadataButtonProps) => {
	const {title, description, link} = props;

	return (
		<Tooltip
			arrow
			placement="right"
			title={
				<>
					<h2 css={titleStyle}>{title}</h2><br />
					<RuntimeMetadataDescription lineClamp={4} darkMode>
						{description}
					</RuntimeMetadataDescription>
					<div css={viewMoreStyle}>Click to view more</div>
				</>
			}
		>
			<IconButton
				style={{margin: "-4px 0", marginLeft: 12}}
				component={Link}
				to={link}
			>
				<AutoStories />
			</IconButton>
		</Tooltip>
	);
};
