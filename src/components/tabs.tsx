/** @jsxImportSource @emotion/react */
import { Theme, css } from "@emotion/react";
import { Tabs as MaterialTabs } from "@mui/material";
import { ReactElement, useState } from "react";

export const tabsWrapperStyle = css`
	margin-top: -16px;
	margin-bottom: 16px;
	border-bottom: solid 1px rgba(0, 0, 0, 0.12);
`;

export const tabsStyle = (theme: Theme) => css`
	margin-bottom: -1px;

	.MuiTabs-indicator {
		height: 3px;
		background-color: ${theme.palette.secondary.main};
	}
`;

export const tabStyle = (theme: Theme) => css`
	display: flex;
	flex-direction: row;
	align-items: center;

	&.Mui-selected {
		color: ${theme.palette.secondary.main};
		font-weight: 700;
		background-color: #f5f5f5;

		.MuiCircularProgress-root {
			color: #${theme.palette.secondary.main};
		}
	}

	.MuiCircularProgress-root {
		color: rgba(0, 0, 0, 0.6);
		margin-left: 8px;
	}
`;

type TabsProps = {
	tabHandles: ReactElement[];
	tabPanes: ReactElement[];
}

export const Tabs = (props: TabsProps) => {
	const { tabHandles, tabPanes } = props;

	const [tab, setTab] = useState<string | undefined>(undefined);

	return (
		<>
			<div css={tabsWrapperStyle}>
				<MaterialTabs
					css={tabsStyle}
					onChange={(_, tab) => setTab(tab)}
					// eslint-disable-next-line
					value={tab || tabHandles[0]!.props.value}
				>
					{tabHandles}
				</MaterialTabs>

			</div>
			{tab ? tabPanes.find((it) => it.key === tab) : tabPanes[0]}
		</>
	);
};
