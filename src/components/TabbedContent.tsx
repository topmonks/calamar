/** @jsxImportSource @emotion/react */
import { Children, cloneElement, PropsWithChildren, ReactElement, ReactNode, useState } from "react";
import { Theme, css } from "@emotion/react";
import { CircularProgress, Tab, Tabs } from "@mui/material";

const tabsWrapperStyle = css`
	margin-bottom: 16px;
	border-bottom: solid 1px rgba(0, 0, 0, 0.12);
`;

const tabsStyle = (theme: Theme) => css`
	margin-bottom: -1px;

	.MuiTabs-indicator {
		height: 3px;
		background-color: ${theme.palette.secondary.main};
	}
`;

const tabStyle = (theme: Theme) => css`
	display: flex;
	flex-direction: row;
	align-items: center;

	&.Mui-selected {
		color: ${theme.palette.secondary.main};
		font-weight: 700;
		background-color: #f5f5f5;
	}
`;

const tabCountStyle = css`
	&::before {
		content: ' ';
	}
`;

const tabLoadingStyle = (theme: Theme) => css`
	margin-left: 8px;
	color: rgba(0, 0, 0, 0.6);

	.Mui-selected & {
		color: ${theme.palette.secondary.main};
	}
`;

export type TabPaneProps = PropsWithChildren<{
	label: ReactNode;
	count?: number;
	loading?: boolean;
	value: string;
}>

export const TabPane = (props: TabPaneProps) => {
	return <>{props.children}</>;
};

export type TabbedContentProps = {
	children: (ReactElement<TabPaneProps>|false)[];
}

export const TabbedContent = (props: TabbedContentProps) => {
	const { children } = props;

	const [tab, setTab] = useState<string | undefined>(undefined);

	const tabHandles = Children.map(children, (child) => (
		child && <Tab
			key={child.props.value}
			css={tabStyle}
			label={
				<span>
					<span>{child.props.label}</span>
					{child.props.count && <span data-test="count" css={tabCountStyle}>({child.props.count})</span>}
					{(child.props.loading) && <CircularProgress css={tabLoadingStyle} size={14} />}
				</span>
			}
			value={child.props.value}
		/>
	));

	const tabPanes = Children.map(children, (child) => child && cloneElement(child, {key: child.props.value}));

	return (
		<>
			<div css={tabsWrapperStyle}>
				<Tabs
					css={tabsStyle}
					onChange={(_, tab) => setTab(tab)}
					value={tab || tabHandles[0]!.props.value}
				>
					{tabHandles}
				</Tabs>

			</div>
			{tab ? tabPanes.find((it) => it.props.value === tab) : tabPanes[0]}
		</>
	);
};
