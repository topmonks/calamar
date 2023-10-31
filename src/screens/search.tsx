/** @jsxImportSource @emotion/react */
import { Fragment, useEffect, useRef, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
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

import { getNetworks } from "../services/networksService";

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

const xxStyle = css`
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
	border-radius: 8px;

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

const loadingStyle = css`
	text-align: center;
	word-break: break-all;
`;

export const SearchPage = () => {
	const [qs] = useSearchParams();

	const query = qs.get("query") || "";
	const networkNames = qs.getAll("network");

	const [tab, setTab] = useTab({
		preserveQueryParams: ["query", "network"]
	});

	const previousQueryRef = useRef<string>();
	const previousNetworkNamesRef = useRef<string[]>();

	const [page, setPage] = usePage();

	console.log("query", query, networkNames);

	const [forceLoading, setForceLoading] = useState<boolean>(true);

	const searchResult = useSearch(query, getNetworks(networkNames), {
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
			return <Navigate to={`/${extrinsicItem.network}/extrinsic/${extrinsicItem.data.id}`} replace />;
		}

		const blockItem = searchResult.blocks.data?.[0];
		if (blockItem?.data) {
			return <Navigate to={`/${blockItem.network}/block/${blockItem.data.id}`} replace />;
		}

		const accountItem = searchResult.accounts.data?.[0];
		if (accountItem?.data) {
			return <Navigate to={`/${accountItem.network}/account/${accountItem.data.id}`} replace />;
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

	if (searchResult.notFound) {
		return (
			<Card>
				<NotFound>Nothing was found for query <span css={queryStyle}>{query}</span></NotFound>
			</Card>
		);
	}

	if (searchResult.error) {
		return (
			<Card>
				<ErrorMessage
					message={<>Unexpected error occured while searching for <span css={queryStyle}>{query}</span></>}
					details={searchResult.error}
					report
				/>
			</Card>
		);
	}

	return (
		<>
			<Card>
				<CardHeader>
					Search results
				</CardHeader>
				<div css={xxStyle}>
					For query <code css={queryStyle2}>{query}</code> in {" "}
					{networkNames.length === 0 && <span>all networks.</span>}
					{networkNames.length > 0 && (
						<>
							{getNetworks(networkNames).slice(0, 5).map((it, index) =>
								<Fragment key={it.name}>
									<span css={networkStyle}>
										<img src={it.icon} css={iconStyle} /> {it.displayName}
									</span>
									{index <= networkNames.length - 3 && <span>, </span>}
									{index === networkNames.length - 2 && <span> and </span>}
								</Fragment>
							)} network{networkNames.length > 1 && <span>s</span>}.
						</>
					)}
				</div>
				{searchResult.data?.errors && searchResult.data?.errors.length > 0 && (
					<ErrorMessage
						css={errorStyle}
						message={<>Unexpected error occured while searching some networks</>}
						details={searchResult.data.errors}
						report
					/>
				)}
			</Card>
			{searchResult.data &&
				<Card>
					<TabbedContent currentTab={tab} onTabChange={setTab}>
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
				</Card>
			}
		</>
	);
};
