/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { css } from "@emotion/react";

import { useAccount } from "../hooks/useAccount";
import { useBlock } from "../hooks/useBlock";
import { useEventsWithoutTotalCount } from "../hooks/useEventsWithoutTotalCount";
import { useExtrinsic } from "../hooks/useExtrinsic";
import { useExtrinsicsWithoutTotalCount } from "../hooks/useExtrinsicsWithoutTotalCount";

import { Card, CardHeader } from "./Card";
import { ErrorMessage } from "./ErrorMessage";
import ExtrinsicsTable from "./extrinsics/ExtrinsicsTable";
import EventsTable from "./events/EventsTable";
import Spinner from "./Spinner";
import { TabbedContent, TabPane } from "./TabbedContent";

const loadingStyle = css`
	padding: 32px 0;
	text-align: center;
	font-size: 24px;
	word-break: break-all;
`;

const loadingMessageStyle = css`
	margin-bottom: 40px;
`;

type SearchProps = {
	network: string;
	query: string;
};

const Search = (props: SearchProps) => {
	const { network, query } = props;

	const [forceLoading, setForceLoading] = useState<boolean>(true);

	const maybeHash = query.startsWith("0x");
	const maybeHeight = query.match(/^\d+$/);
	const maybeName = !maybeHash && !maybeHeight;

	const extrinsicByHash = useExtrinsic(network, { hash_eq: query }, { skip: !maybeHash });
	const blockByHash = useBlock(network, { hash_eq: query }, { skip: !maybeHash });
	const account = useAccount(network, query);

	const blockByHeight = useBlock(network, { height_eq: parseInt(query) }, { skip: !maybeHeight });

	const extrinsicsByName = useExtrinsicsWithoutTotalCount(network, { call: { name_eq: query }}, "id_DESC", { skip: !maybeName });
	const eventsByName = useEventsWithoutTotalCount(network, { name_eq: query }, "id_DESC", { skip: !maybeName });

	const allResources = [extrinsicByHash, blockByHash, account, blockByHeight, extrinsicsByName, eventsByName];
	const multipleResultsResources = [extrinsicsByName, eventsByName];

	useEffect(() => {
		// show loading at least for 1s to prevent flickering
		setTimeout(() => setForceLoading(false), 1000);
	}, [query]);

	console.log(allResources);

	if (!forceLoading) {
		if (extrinsicByHash.data) {
			return <Navigate to={`/${network}/extrinsic/${extrinsicByHash.data.id}`} />;
		}

		if (blockByHash.data || blockByHeight.data) {
			return <Navigate to={`/${network}/block/${blockByHash.data?.id || blockByHeight.data?.id}`} />;
		}

		if (account.data) {
			return <Navigate to={`/${network}/account/${account.data.id}`} />;
		}

		if (multipleResultsResources.some(it => it.items?.length > 0)) {
			return (
				<Card>
					<CardHeader>
						Search results for query <span style={{ fontWeight: "normal" }}>{query}</span>
					</CardHeader>
					<TabbedContent>
						{!extrinsicsByName.notFound &&
							<TabPane
								label="Extrinsics"
								count={extrinsicsByName.pagination.totalCount}
								loading={extrinsicsByName.loading}
								error={extrinsicsByName.error}
								value="extrinsicsByName"
							>
								<ExtrinsicsTable network={network} {...extrinsicsByName} />
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

		if (allResources.every(it => it.notFound)) {
			const error = allResources.find(it => it.error)?.error;

			if (error) {
				<Card>
					<CardHeader>
						Search results for query <span style={{ fontWeight: "normal" }}>{query}</span>
					</CardHeader>
					<ErrorMessage
						message="Unexpected error occured while searching"
						details={error.message}
						showReported
					/>
				</Card>;
			}

			return (
				<Card>
					<CardHeader>
						Search results for query <span style={{ fontWeight: "normal" }}>{query}</span>
					</CardHeader>
					<div>
						Nothing was found
					</div>
				</Card>
			);
		}
	}

	return (
		<Card>
			<div css={loadingStyle}>
				<div css={loadingMessageStyle}>
					<strong>Searching for</strong>{" "}
					<span style={{ fontWeight: "normal" }}>
						<q lang="en">{query}</q>
					</span>
				</div>
				<Spinner />
			</div>
		</Card>
	);
};

export default Search;
