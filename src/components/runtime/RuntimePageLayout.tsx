/** @jsxImportSource @emotion/react */
import { ReactNode } from "react";
import { useNavigate } from "react-router";
import { Breadcrumbs, MenuItem, Select } from "@mui/material";
import { Theme, css } from "@emotion/react";

import { useRuntimeSpecVersions } from "../../hooks/useRuntimeSpecVersions";
import { Network } from "../../model/network";

import { Card, CardHeader } from "../Card";
import { NetworkSelect } from "../NetworkSelect";

const breadcrumbsStyle = css`
	margin-top: -16px;

	color: inherit;

	a {
		font-family: inherit;
		font-weight: 400;
		color: inherit;
	}

	.highlighted {
		font-weight: 600;
	}

	.MuiBreadcrumbs-li:last-child {
		font-weight: 600;
	}
`;

const networkSelectStyle = css`
	padding: 2px 12px;
	padding-right: 6px;
`;

const specVersionSelectStyle = (theme: Theme) => css`
	.MuiSelect-select {
		padding: 3px 12px !important;
		padding-right: 42px !important;
		line-height: 28px;
		font-size: 16px;
		height: auto !important;
		color: ${theme.palette.neutral.main}
	}

	&, &:hover, &.Mui-focused {
		.MuiOutlinedInput-notchedOutline {
			border-color: #bdbdbd;
		}
	}
`;

export interface RuntimePageLayoutProps {
	network: Network;
	specVersion: string;
	breadcrumbs?: ReactNode[];
	children: ReactNode;
}

export const RuntimePageLayout = (props: RuntimePageLayoutProps) => {
	const {network, specVersion, breadcrumbs, children} = props;

	const navigate = useNavigate();

	const runtimeVersions = useRuntimeSpecVersions(network.name);

	return (
		<>
			<Card>
				<CardHeader>
					Metadata explorer
				</CardHeader>
				<Breadcrumbs css={breadcrumbsStyle}>
					<NetworkSelect
						css={networkSelectStyle}
						value={[network]}
						onChange={([network]) => navigate(`/${network?.name}/runtime`)}
					/>
					<Select
						css={specVersionSelectStyle}
						value={specVersion}
						onChange={e => navigate(`/${network.name}/runtime/${e.target.value}`)}
						renderValue={(specVersion) => `Spec version ${specVersion}`}
					>
						{(runtimeVersions.data || [specVersion]).map(version =>
							<MenuItem key={version} value={version}>
								{version}
							</MenuItem>
						)}
					</Select>
					{breadcrumbs}
				</Breadcrumbs>
			</Card>
			{children}
		</>
	);
};
