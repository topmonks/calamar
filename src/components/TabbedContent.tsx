/** @jsxImportSource @emotion/react */
import { Children, cloneElement, PropsWithChildren, ReactElement, ReactNode, useState } from "react";
import { Theme, css } from "@emotion/react";
import { Tab, Tabs } from "@mui/material";

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

		.MuiCircularProgress-root {
			color: #${theme.palette.secondary.main};
		}
	}

	.MuiCircularProgress-root {
		color: rgba(0, 0, 0, 0.6);
		margin-left: 8px;
	}
`;

export type TabPaneProps = PropsWithChildren<{
	label: ReactNode;
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
			label={child.props.label}
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
