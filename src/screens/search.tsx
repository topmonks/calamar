/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
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

	const [page, setPage] = usePage();

	console.log("query", query, networkNames);

	const [forceLoading, setForceLoading] = useState<boolean>(true);

	const searchResult = useSearch(query, getNetworks(networkNames), { page });

	console.log("results", searchResult);

	useEffect(() => {
		// show loading at least for 1s to prevent flickering
		setForceLoading(true);
		setTimeout(() => setForceLoading(false), 1000);
	}, [query]);

	useDOMEventTrigger("data-loaded", !searchResult.loading);

	if (!query) {
		return <Navigate to="/" replace />;
	}

	if (!forceLoading && searchResult.data?.totalCount === 1) {
		const result = searchResult.data;

		const extrinsicItem = result.extrinsicItems.data[0];
		if (extrinsicItem?.data) {
			return <Navigate to={`/${extrinsicItem.network}/extrinsic/${extrinsicItem.data.id}`} replace />;
		}

		const blockItem = result.blockItems.data[0];
		if (blockItem?.data) {
			return <Navigate to={`/${blockItem.network}/block/${blockItem.data.id}`} replace />;
		}

		const accountItem = result.accountItems.data[0];
		if (accountItem?.data) {
			return <Navigate to={`/${accountItem.network}/account/${accountItem.data.id}`} replace />;
		}
	}

	if (searchResult.loading || forceLoading) {
		return (
			<Card>
				<CardHeader css={loadingStyle}>
					Searching for <span css={queryStyle}>{query}</span>
				</CardHeader>
				<Loading />
			</Card>
		);
	}

	if (searchResult.notFound || !searchResult.data) {
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
					details={searchResult.error.message}
					showReported
				/>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				Search results for query <span css={queryStyle}>{query}</span>
			</CardHeader>
			<TabbedContent currentTab={tab} onTabChange={setTab}>
				<TabPane
					label="Accounts"
					count={searchResult.data.accountsTotalCount}
					value="accounts"
					hide={searchResult.data.accountsTotalCount === 0}
				>
					<AccountSearchResultsTable
						items={searchResult.data.accountItems}
						query={query}
						onPageChange={setPage}
					/>
				</TabPane>
				<TabPane
					label="Blocks"
					count={searchResult.data.blocksTotalCount}
					value="blocks"
					hide={searchResult.data.blocksTotalCount === 0}
				>
					<BlockSearchResultsTable
						items={searchResult.data.blockItems}
						query={query}
						onPageChange={setPage}
					/>
				</TabPane>
				<TabPane
					label="Extrinsics"
					count={searchResult.data.extrinsicsTotalCount}
					value="extrinsics"
					hide={searchResult.data.extrinsicsTotalCount === 0}
				>
					<ExtrinsicSearchResultsTable
						items={searchResult.data.extrinsicItems}
						query={query}
						onPageChange={setPage}
					/>
				</TabPane>
				<TabPane
					label="Events"
					count={searchResult.data.eventsTotalCount}
					value="events"
					hide={searchResult.data.eventsTotalCount === 0}
				>
					<EventSearchResultsTable
						items={searchResult.data.eventItems}
						query={query}
						onPageChange={setPage}
					/>
				</TabPane>
			</TabbedContent>
		</Card>
	);
};
