/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { Navigate, useParams, useSearchParams } from "react-router-dom";
import { css } from "@emotion/react";
import { isHex } from "@polkadot/util";
import { isAddress } from "@polkadot/util-crypto";

import { useAccount } from "../hooks/useAccount";
import { useBlock } from "../hooks/useBlock";
import { useEventsWithoutTotalCount } from "../hooks/useEventsWithoutTotalCount";
import { useExtrinsic } from "../hooks/useExtrinsic";
import { useExtrinsicsWithoutTotalCount } from "../hooks/useExtrinsicsWithoutTotalCount";

import { Card, CardHeader } from "../components/Card";
import { ErrorMessage } from "../components/ErrorMessage";
import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";
import EventsTable from "../components/events/EventsTable";
import { TabbedContent, TabPane } from "../components/TabbedContent";
import NotFound from "../components/NotFound";
import Loading from "../components/Loading";
import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";

const queryStyle = css`
	font-weight: normal;

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

type SearchPageParams = {
	network: string;
};

function SearchPage() {
	const { network } = useParams() as SearchPageParams;

	const [qs] = useSearchParams();
	const query = qs.get("query") || "";

	const [forceLoading, setForceLoading] = useState<boolean>(true);

	const maybeHash = isHex(query);
	const maybeHeight = query?.match(/^\d+$/);
	const maybeAddress = isAddress(query);
	const maybeName = query && !maybeHash && !maybeHeight;

	const extrinsicByHash = useExtrinsic(network, { hash_eq: query }, { skip: !maybeHash });
	const blockByHash = useBlock(network, { hash_eq: query }, { skip: !maybeHash });
	const account = useAccount(network, query, { skip: !maybeAddress });

	const blockByHeight = useBlock(network, { height_eq: parseInt(query) }, { skip: !maybeHeight });

	const extrinsicsByName = useExtrinsicsWithoutTotalCount(network, { call: { name_eq: query }}, "id_DESC", { skip: !maybeName });
	const eventsByName = useEventsWithoutTotalCount(network, { name_eq: query }, "id_DESC", { skip: !maybeName });

	const allResources = [extrinsicByHash, blockByHash, account, blockByHeight, extrinsicsByName, eventsByName];
	const multipleResultsResources = [extrinsicsByName, eventsByName];

	const showResults = multipleResultsResources.some(it => it.items?.length > 0);
	const showLoading = forceLoading || (allResources.some(it => it.loading) && !showResults);
	const showNotFound = allResources.every(it => it.notFound);
	const error = allResources.find(it => it.error)?.error;
	const showError = error && allResources.every(it => it.error || it.notFound);

	useEffect(() => {
		// show loading at least for 1s to prevent flickering
		setForceLoading(true);
		setTimeout(() => setForceLoading(false), 1000);
	}, [query]);

	useDOMEventTrigger("data-loaded", allResources.every(it => !it.loading));

	console.log(allResources);

	if (!query) {
		return <Navigate to="/" replace />;
	}

	if (!forceLoading) {
		if (extrinsicByHash.data) {
			return <Navigate to={`/${network}/extrinsic/${extrinsicByHash.data.id}`} replace />;
		}

		if (blockByHash.data || blockByHeight.data) {
			return <Navigate to={`/${network}/block/${blockByHash.data?.id || blockByHeight.data?.id}`} replace />;
		}

		if (account.data) {
			return <Navigate to={`/${network}/account/${account.data.id}`} replace />;
		}
	}

	if (showLoading) {
		return (
			<Card>
				<CardHeader css={loadingStyle}>
					Searching for <span css={queryStyle}>{query}</span>
				</CardHeader>
				<Loading />
			</Card>
		);
	}

	if (showNotFound) {
		return (
			<Card>
				<NotFound>Nothing was found for query <span css={queryStyle}>{query}</span></NotFound>
			</Card>
		);
	}

	if (showError && error) {
		return (
			<Card>
				<ErrorMessage
					message={<>Unexpected error occured while searching for <span css={queryStyle}>{query}</span></>}
					details={error.message}
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
			<TabbedContent>
				{!extrinsicsByName.notFound &&
					<TabPane
						label="Extrinsics"
						count={extrinsicsByName.pagination.totalCount}
						loading={extrinsicsByName.loading}
						error={extrinsicsByName.error}
						value="extrinsics"
					>
						<ExtrinsicsTable network={network} {...extrinsicsByName} showAccount showTime />
					</TabPane>
				}
				{!eventsByName.notFound &&
					<TabPane
						label="Events"
						count={eventsByName.pagination.totalCount}
						loading={eventsByName.loading}
						error={eventsByName.error}
						value="events"
					>
						<EventsTable network={network} {...eventsByName} showExtrinsic />
					</TabPane>
				}
			</TabbedContent>
		</Card>
	);
}

export default SearchPage;
