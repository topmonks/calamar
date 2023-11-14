/** @jsxImportSource @emotion/react */
import { Fragment, useEffect, useRef, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { Alert, AlertTitle } from "@mui/material";
import { css } from "@emotion/react";

import { Card, CardHeader } from "../components/Card";
import { ErrorMessage } from "../components/ErrorMessage";
import Loading from "../components/Loading";
import NotFound from "../components/NotFound";

import { BlockSearchResultsTable } from "../components/search/BlockSearchResultsTable";
import { AccountSearchResultsTable } from "../components/search/AccountSearchResultsTable";
import { ExtrinsicSearchResultsTable } from "../components/search/ExtrinsicSearchResultsTable";
import { EventSearchResultsTable } from "../components/search/EventSearchResultsTable";
import { TabbedContent, TabPane } from "../components/TabbedContent";

import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";
import { usePage } from "../hooks/usePage";
import { useSearch } from "../hooks/useSearch";
import { useTab } from "../hooks/useTab";

import { getNetworks, hasSupport } from "../services/networksService";
import { getQueryType } from "../services/searchService";

import { isDeepEqual } from "../utils/equal";

const queryStyle = css`
	font-weight: normal;
	word-break: break-all;

	&::before {
		content: open-quote;
	}

	&::after {
		content: close-quote;
	}
`;

const searchDetailsStyle = css`
	margin-top: -16px;
	line-height: 38px;
`;

const queryStyle2 = css`
	padding: 4px 8px;
	margin: 0 2px;

	font-family: inherit;
	background-color: #f5f5f5;
	border-radius: 6px;

	&::before {
		content: open-quote;
	}

	&::after {
		content: close-quote;
	}
`;

const networkStyle = css`
	padding: 4px 8px;
	background-color: #f5f5f5;
	background-color: rgba(0, 0, 0, .045);
	border-radius: 8px;
	font-size: 1rem;

	white-space: nowrap;
`;

const iconStyle = css`
	width: 20px;
	height: 20px;

	border-radius: 0px;
	margin-right: 4px;

	vertical-align: text-bottom;
	position: relative;
	top: -1px;
`;

const errorStyle = css`
	margin-top: 32px;
`;

const notFoundStyle = css`
	margin-top: 48px;
`;

const loadingStyle = css`
	text-align: center;
	word-break: break-all;
`;

const resultsStyle = css`
	margin-top: 32px;
`;

const unsupportAlertStyle = css`
	margin-top: 32px;
	padding: 16px 24px;
`;

const unsupportAlertNetworks = css`
	margin-top: 20px;
	font-size: 1rem;
`;

export const SearchPage = () => {
	const [qs] = useSearchParams();

	const query = qs.get("query") || "";
	const networkNames = qs.getAll("network");

	const networks = getNetworks(networkNames.length > 0 ? networkNames : undefined);

	const [tab, setTab] = useTab({
		preserveQueryParams: ["query", "network"]
	});

	const previousQueryRef = useRef<string>();
	const previousNetworkNamesRef = useRef<string[]>();

	const [page, setPage] = usePage();

	console.log("query", query, networkNames);

	const [forceLoading, setForceLoading] = useState<boolean>(true);

	const searchResult = useSearch(query, networks, {
		pagination: {
			accounts: {
				page: tab === "accounts" ? page : 1,
				pageSize: 10
			},
			blocks: {
				page: tab === "blocks" ? page : 1,
				pageSize: 10
			},
			extrinsics: {
				page: tab === "extrinsics" ? page : 1,
				pageSize: 10
			},
			events: {
				page: tab === "events" ? page : 1,
				pageSize: 10
			}
		},
		keepPreviousData:
			query === previousQueryRef.current
			&& isDeepEqual(networkNames, previousNetworkNamesRef.current)
	});

	console.log("results", searchResult);

	const searchByNameUnsupportNetworks = networks.filter(it =>
		getQueryType(it, query) === "name" && !hasSupport(it.name, "explorer-squid")
	);

	useEffect(() => {
		// show loading at least for 1s to prevent flickering
		setForceLoading(true);
		setTimeout(() => setForceLoading(false), 1000);
	}, [query]);

	useEffect(() => {
		if (!searchResult.loading) {
			previousQueryRef.current = query;
			previousNetworkNamesRef.current = networkNames;
		}
	}, [searchResult.loading]);

	useDOMEventTrigger("data-loaded", !searchResult.loading);

	if (!query) {
		return <Navigate to="/" replace />;
	}

	if (!forceLoading && searchResult.totalCount === 1) {
		const extrinsicItem = searchResult.extrinsics.data?.[0];
		if (extrinsicItem?.data) {
			return <Navigate to={`/${extrinsicItem.network.name}/extrinsic/${extrinsicItem.data.id}`} replace />;
		}

		const blockItem = searchResult.blocks.data?.[0];
		if (blockItem?.data) {
			return <Navigate to={`/${blockItem.network.name}/block/${blockItem.data.id}`} replace />;
		}

		const accountItem = searchResult.accounts.data?.[0];
		if (accountItem?.data) {
			return <Navigate to={`/${accountItem.network.name}/account/${accountItem.data.id}`} replace />;
		}
	}

	if ((!searchResult.data && searchResult.loading) || forceLoading) {
		return (
			<Card>
				<CardHeader css={loadingStyle}>
					Searching for <span css={queryStyle}>{query}</span>
				</CardHeader>
				<Loading />
			</Card>
		);
	}

	return (
		<>
			<Card>
				<CardHeader>
					Search results
				</CardHeader>
				<div css={searchDetailsStyle}>
					For query <code css={queryStyle2}>{query}</code> in {" "}
					{networks.length === getNetworks().length && <span>all networks.</span>}
					{networks.length < getNetworks().length && (
						<>
							{networks.map((it, index) =>
								<Fragment key={it.name}>
									<span css={networkStyle}>
										<img src={it.icon} css={iconStyle} /> {it.displayName}
									</span>
									{index <= networks.length - 3 && <span>, </span>}
									{index === networks.length - 2 && <span> and </span>}
								</Fragment>
							)} network{networks.length > 1 && <span>s</span>}.
						</>
					)}
				</div>
				{searchByNameUnsupportNetworks.length > 0 && (
					<Alert severity="warning" css={unsupportAlertStyle}>
						<AlertTitle>The following networks don't currently support searching for extrinsics and events by name.</AlertTitle>
						<div css={unsupportAlertNetworks}>
							{searchByNameUnsupportNetworks.map((it, index, list) =>
								<Fragment key={it.name}>
									<span css={networkStyle}>
										<img src={it.icon} css={iconStyle} /> {it.displayName}
									</span>
									{index <= list.length - 3 && <span>, </span>}
									{index === list.length - 2 && <span> and </span>}
								</Fragment>
							)}
						</div>
					</Alert>
				)}
				{searchResult.error && (
					<Card>
						<ErrorMessage
							message="Unexpected error occured."
							details={searchResult.error}
							report
						/>
					</Card>
				)}
				{searchResult.data?.errors && searchResult.data?.errors.length > 0 && (
					<ErrorMessage
						css={errorStyle}
						message="Unexpected error occured while searching some networks."
						details={searchResult.data.errors}
						report
					/>
				)}
				{searchResult.data && searchResult.data.totalCount === 0 && (
					<NotFound css={notFoundStyle}>Nothing was found</NotFound>
				)}
				{searchResult.data && searchResult.data.totalCount > 0 && (
					<TabbedContent css={resultsStyle} currentTab={tab} onTabChange={setTab}>
						<TabPane
							value="accounts"
							label="Accounts"
							count={searchResult.accounts.totalCount}
							loading={searchResult.accounts.loading}
							error={searchResult.accounts.error}
							hide={searchResult.accounts.totalCount === 0}
						>
							<AccountSearchResultsTable
								accounts={searchResult.accounts}
								query={query}
								onPageChange={setPage}
							/>
						</TabPane>
						<TabPane
							value="blocks"
							label="Blocks"
							count={searchResult.blocks.totalCount}
							loading={searchResult.blocks.loading}
							error={searchResult.blocks.error}
							hide={searchResult.blocks.totalCount === 0}
						>
							<BlockSearchResultsTable
								blocks={searchResult.blocks}
								query={query}
								onPageChange={setPage}
							/>
						</TabPane>
						<TabPane
							value="extrinsics"
							label="Extrinsics"
							count={searchResult.extrinsics.totalCount}
							loading={searchResult.extrinsics.loading}
							error={searchResult.extrinsics.error}
							hide={searchResult.extrinsics.totalCount === 0}
						>
							<ExtrinsicSearchResultsTable
								extrinsics={searchResult.extrinsics}
								query={query}
								onPageChange={setPage}
							/>
						</TabPane>
						<TabPane
							value="events"
							label="Events"
							count={searchResult.events.totalCount}
							loading={searchResult.events.loading}
							error={searchResult.events.error}
							hide={searchResult.events.totalCount === 0}
						>
							<EventSearchResultsTable
								events={searchResult.events}
								query={query}
								onPageChange={setPage}
							/>
						</TabPane>
					</TabbedContent>
				)}
			</Card>
		</>
	);
};
