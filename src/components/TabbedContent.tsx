/** @jsxImportSource @emotion/react */
import { Children, cloneElement, PropsWithChildren, ReactElement, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { CircularProgress, Tab, TabProps, Tabs } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Warning";
import { Theme, css } from "@emotion/react";

import { formatNumber } from "../utils/number";

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
	margin-left: 4px;
`;

const tabErrorStyle = css`
	margin-left: 8px;
	position: relative;
	top: 1px;
	color: #ef5350;
`;

const tabLoadingStyle = (theme: Theme) => css`
	margin-left: 8px;
	color: rgba(0, 0, 0, 0.6);

	.Mui-selected & {
		color: ${theme.palette.secondary.main};
	}
`;

export type TabPaneProps = Omit<TabProps, "children"> & PropsWithChildren<{
	label: ReactNode;
	value: string;
	count?: number;
	loading?: boolean;
	error?: boolean;
	hide?: boolean;
}>

export const TabPane = (props: TabPaneProps) => {
	return <>{props.children}</>;
};

export type TabbedContentProps = {
	children: ReactElement<TabPaneProps>|(ReactElement<TabPaneProps>|false)[];
	currentTab?: string;
	onTabChange: (tab: string) => void;
}

export const TabbedContent = (props: TabbedContentProps) => {
	const { children, currentTab: tab, onTabChange } = props;

	const tabHandles = useMemo(() => Children.map(children, (child) => {
		if (!child) {
			return null;
		}

		const {
			value,
			label,
			count,
			loading,
			error,
			hide,
			children, // ignore
			...restProps
		} = child.props;

		if (hide && tab !== value) {
			return null;
		}

		return (
			<Tab
				title=""
				key={value}
				css={tabStyle}
				label={
					<>
						<span>{label}</span>
						{count !== undefined && <span data-test="count" css={tabCountStyle}>({formatNumber(count)})</span>}
						{(loading) && <CircularProgress css={tabLoadingStyle} size={14} />}
						{!!error && <ErrorIcon css={tabErrorStyle} />}
					</>
				}
				value={value}
				data-test={`${value}-tab`}
				{...restProps}
			/>
		);
	}), [children]);

	const tabPanes = useMemo(() => Children.map(children, (child) => child && cloneElement(child, {key: child.props.value})), [children]);
	const currentTabPane = tabPanes.find((it) => it.props.value === tab);

	const handleTabChange = useCallback((ev: any, value: string) => {
		onTabChange?.(value);
	}, [onTabChange]);

	useEffect(() => {
		if (!currentTabPane) {
			tabHandles[0] && onTabChange?.(tabHandles[0].props.value);
		}
	}, [currentTabPane, tabPanes, onTabChange]);

	return (
		<>
			<div css={tabsWrapperStyle}>
				<Tabs
					css={tabsStyle}
					onChange={handleTabChange}
					value={tab || tabHandles[0]?.props.value}
					variant="scrollable"
					scrollButtons={false}
				>
					{tabHandles}
				</Tabs>

			</div>
			{currentTabPane}
		</>
	);
};
