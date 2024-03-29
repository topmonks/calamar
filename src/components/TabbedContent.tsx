/** @jsxImportSource @emotion/react */
import { Children, cloneElement, HTMLAttributes, PropsWithChildren, ReactElement, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
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

export interface TabbedContentProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactElement<TabPaneProps>|(ReactElement<TabPaneProps>|false)[];
	currentTab?: string;
	onTabChange: (tab: string) => void;
}

export const TabbedContent = (props: TabbedContentProps) => {
	const { children, currentTab, onTabChange, ...divProps } = props;

	const tabHandles = Children.map(children, (child) => {
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

		if (hide && currentTab !== value) {
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
						{(count === undefined && loading) && <CircularProgress css={tabLoadingStyle} size={14} />}
						{!!error && <ErrorIcon css={tabErrorStyle} />}
					</>
				}
				value={value}
				data-test={`${value}-tab`}
				{...restProps}
			/>
		);
	});

	const tabPanes = Children.map(children, (child) =>
		child && cloneElement(child, {key: child.props.value})
	);

	const handleTabChange = useCallback((ev: any, value: string) => {
		onTabChange?.(value);
	}, [onTabChange]);

	useEffect(() => {
		if (!currentTab) {
			tabHandles[0] && onTabChange?.(tabHandles[0].props.value);
		}
	}, [currentTab]);

	return (
		<div {...divProps}>
			<div css={tabsWrapperStyle}>
				<Tabs
					css={tabsStyle}
					onChange={handleTabChange}
					value={currentTab || tabHandles[0]?.props.value}
					variant="scrollable"
					scrollButtons={false}
				>
					{tabHandles}
				</Tabs>

			</div>
			{tabPanes.find((it) => it.props.value === currentTab)}
		</div>
	);
};
