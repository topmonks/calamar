import { Theme, css } from "@emotion/react";

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
