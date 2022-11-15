/** @jsxImportSource @emotion/react */
import { Children, cloneElement, PropsWithChildren, ReactElement, ReactNode, useState } from "react";
import { Theme, css } from "@emotion/react";
import { CircularProgress, Tab, TabProps, Tabs } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Warning";

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
	count?: number;
	loading?: boolean;
	error?: boolean;
	value: string;
}>

export const TabPane = (props: TabPaneProps) => {
	return <>{props.children}</>;
};

export type TabbedContentProps = {
	children: ReactElement<TabPaneProps>|(ReactElement<TabPaneProps>|false)[];
}

export const TabbedContent = (props: TabbedContentProps) => {
	const { children } = props;

	const [tab, setTab] = useState<string | undefined>(undefined);

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
			children, // ignore
			...restProps
		} = child.props;

		return (
			<Tab
				title=""
				key={value}
				css={tabStyle}
				label={
					<>
						<span>{label}</span>
						{Number.isInteger(count) && <span data-test="count" css={tabCountStyle}>({count})</span>}
						{(loading) && <CircularProgress css={tabLoadingStyle} size={14} />}
						{!!error && <ErrorIcon css={tabErrorStyle} />}
					</>
				}
				value={value}
				data-test={`${value}-tab`}
				{...restProps}
			/>
		);
	});

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
