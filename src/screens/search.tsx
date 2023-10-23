/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { css } from "@emotion/react";

import { AccountAddress } from "../components/AccountAddress";
import { ButtonLink } from "../components/ButtonLink";
import { Card, CardHeader } from "../components/Card";
import DataViewer from "../components/DataViewer";
import { ErrorMessage } from "../components/ErrorMessage";
import { Link } from "../components/Link";
import Loading from "../components/Loading";
import NotFound from "../components/NotFound";
import { SearchResultsTable, SearchResultsTableItemAttribute } from "../components/search/SearchResultsTable";
import { TabbedContent, TabPane } from "../components/TabbedContent";
import { Time } from "../components/Time";

import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";
import { useSearch } from "../hooks/useSearch";

import { Account } from "../model/account";
import { Block } from "../model/block";
import { Event } from "../model/event";
import { Extrinsic } from "../model/extrinsic";

import { getNetworks } from "../services/networksService";
import { NetworkSearchResult } from "../services/searchService";

import { encodeAddress } from "../utils/address";
import { useTabParam } from "../hooks/useTabParam";

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

const eventArgsColCss = css`
	width: 35%;
`;

export const SearchPage = () => {
	const [qs] = useSearchParams();

	const query = qs.get("query") || "";
	const networkNames = qs.getAll("network");

	const [tab, setTab] = useTabParam({
		preserveQueryParams: ["query", "network"]
	});

	console.log("query", query, networkNames);

	const [forceLoading, setForceLoading] = useState<boolean>(true);

	const searchResults = useSearch(query, getNetworks(networkNames));

	console.log("results", searchResults);

	useEffect(() => {
		// show loading at least for 1s to prevent flickering
		setForceLoading(true);
		setTimeout(() => setForceLoading(false), 1000);
	}, [query]);

	useDOMEventTrigger("data-loaded", !searchResults.loading);

	if (!query) {
		return <Navigate to="/" replace />;
	}

	if (!forceLoading && searchResults.data?.total === 1) {
		const result = searchResults.data.results[0] as NetworkSearchResult;

		if (result.extrinsics.data[0]) {
			return <Navigate to={`/${result.network.name}/extrinsic/${result.extrinsics.data[0].id}`} replace />;
		}

		if (result.blocks.data[0]) {
			return <Navigate to={`/${result.network.name}/block/${result.blocks.data[0].id}`} replace />;
		}

		if (result.accounts.data[0]) {
			return <Navigate to={`/${result.network.name}/account/${result.accounts.data[0].id}`} replace />;
		}
	}

	if (searchResults.loading || forceLoading) {
		return (
			<Card>
				<CardHeader css={loadingStyle}>
					Searching for <span css={queryStyle}>{query}</span>
				</CardHeader>
				<Loading />
			</Card>
		);
	}

	if (searchResults.notFound || !searchResults.data) {
		return (
			<Card>
				<NotFound>Nothing was found for query <span css={queryStyle}>{query}</span></NotFound>
			</Card>
		);
	}

	if (searchResults.error) {
		return (
			<Card>
				<ErrorMessage
					message={<>Unexpected error occured while searching for <span css={queryStyle}>{query}</span></>}
					details={searchResults.error.message}
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
				{searchResults.data.accountsTotal > 0 &&
					<TabPane
						label="Accounts"
						count={searchResults.data.accountsTotal}
						value="accounts"
					>
						<SearchResultsTable<Account>
							query={query}
							results={searchResults.data.results}
							getItems={(result) => result.accounts}
							itemsPlural="accounts"
						>
							<SearchResultsTableItemAttribute<Account>
								label="Account"
								render={(account, network) => (
									<AccountAddress
										address={encodeAddress(account.id, network.prefix)}
										network={network}
										copyToClipboard="small"
									/>
								)}
							/>
						</SearchResultsTable>
					</TabPane>
				}
				{searchResults.data.blocksTotal > 0 &&
					<TabPane
						label="Blocks"
						count={searchResults.data.blocksTotal}
						value="blocks"
					>
						<SearchResultsTable<Block>
							query={query}
							results={searchResults.data.results}
							getItems={(result) => result.blocks}
							itemsPlural="blocks"
						>
							<SearchResultsTableItemAttribute<Block>
								label="Block (Height)"
								render={(block, network) =>
									<Link to={`/${network.name}/block/${block.id}`}>
										{block.height}
									</Link>
								}
							/>
							<SearchResultsTableItemAttribute<Block>
								label="Spec version"
								render={(block) =>
									<>{block.specVersion}</>
								}
							/>
							<SearchResultsTableItemAttribute<Block>
								label="Validator"
								render={(block, network) =>
									block.validator &&
									<AccountAddress
										network={network}
										address={block.validator}
										shorten
										copyToClipboard="small"
									/>
								}
							/>
							<SearchResultsTableItemAttribute<Block>
								label="Time"
								render={(block) =>
									<Time time={block.timestamp} fromNow tooltip utc />
								}
							/>
						</SearchResultsTable>
					</TabPane>
				}
				{searchResults.data.extrinsicsTotal > 0 &&
					<TabPane
						label="Extrinsics"
						count={searchResults.data.extrinsicsTotal}
						value="extrinsics"
					>
						<SearchResultsTable<Extrinsic>
							query={query}
							results={searchResults.data.results}
							getItems={(result) => result.extrinsics}
							itemsPlural="extrinsics"
						>
							<SearchResultsTableItemAttribute<Extrinsic>
								label="Extrinsic (ID)"
								render={(extrinsic, network) => (
									<Link to={`/${network.name}/extrinsic/${extrinsic.id}`}>
										{extrinsic.id}
									</Link>
								)}
							/>
							<SearchResultsTableItemAttribute<Extrinsic>
								label="Name"
								render={(extrinsic, network) => (
									<ButtonLink
										to={`/${network.name}/search?query=${extrinsic.palletName}.${extrinsic.callName}`}
										size="small"
										color="secondary"
									>
										{extrinsic.palletName}.{extrinsic.callName}
									</ButtonLink>
								)}
							/>
							<SearchResultsTableItemAttribute<Extrinsic>
								label="Account"
								render={(extrinsic, network) =>
									extrinsic.signer &&
											<AccountAddress
												network={network}
												address={extrinsic.signer}
												shorten
												copyToClipboard="small"
											/>
								}
							/>
							<SearchResultsTableItemAttribute<Extrinsic>
								label="Time"
								render={(extrinsic) => (
									<Time time={extrinsic.timestamp} fromNow tooltip utc />
								)}
							/>
						</SearchResultsTable>
					</TabPane>
				}
				{searchResults.data.eventsTotal > 0 &&
					<TabPane
						label="Events"
						count={searchResults.data.eventsTotal}
						value="events"
					>
						<SearchResultsTable<Event>
							query={query}
							results={searchResults.data.results}
							getItems={(result) => result.events}
							itemsPlural="events"
						>
							<SearchResultsTableItemAttribute<Event>
								label="Event (ID)"
								render={(event, network) => (
									<Link to={`/${network.name}/event/${event.id}`}>
										{event.id}
									</Link>
								)}
							/>
							<SearchResultsTableItemAttribute<Event>
								label="Name"
								render={(event, network) => (
									<ButtonLink
										to={`/${network.name}/search?query=${event.palletName}.${event.eventName}`}
										size="small"
										color="secondary"
									>
										{event.palletName}.{event.eventName}
									</ButtonLink>
								)}
							/>
							<SearchResultsTableItemAttribute<Event>
								label="Extrinsic"
								render={(event, network) => (
									<Link to={`/${network.name}/extrinsic/${event.extrinsicId}`}>
										{event.extrinsicId}
									</Link>
								)}
							/>
							<SearchResultsTableItemAttribute<Event>
								label="Parameters"
								colCss={eventArgsColCss}
								render={(event, network) => {
									if (!event.args) {
										return null;
									}

									return (
										<DataViewer
											network={network}
											data={event.args}
											metadata={event.metadata.event?.args}
											copyToClipboard
										/>
									);
								}}
							/>
						</SearchResultsTable>
					</TabPane>
				}
			</TabbedContent>
		</Card>
	);
};
