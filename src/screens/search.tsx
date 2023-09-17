/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { css } from "@emotion/react";

import { Card, CardHeader } from "../components/Card";
import { ErrorMessage } from "../components/ErrorMessage";
import Loading from "../components/Loading";
import NotFound from "../components/NotFound";
import { TabbedContent, TabPane } from "../components/TabbedContent";

import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";
import { useNetworkLoaderData } from "../hooks/useRootLoaderData";
import { useSearch } from "../hooks/useSearch";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { ItemId } from "../services/searchService";
import { Link } from "../components/Link";
import { AccountAddress } from "../components/AccountAddress";
import { encodeAddress } from "../utils/formatAddress";

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

	const [forceLoading, setForceLoading] = useState<boolean>(true);

	const searchResults = useSearch(query);

	console.log("rerender");

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
		const [network, result] = searchResults.data.results[0]!;

		if (result.extrinsics[0]) {
			return <Navigate to={`/${network.name}/extrinsic/${result.extrinsics[0].id}`} replace />;
		}

		if (result.blocks[0]) {
			return <Navigate to={`/${network.name}/block/${result.blocks[0].id}`} replace />;
		}

		if (result.accounts[0]) {
			return <Navigate to={`/${network.name}/account/${result.accounts[0].id}`} replace />;
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
			<TabbedContent>
				{searchResults.data.accountsTotal > 0 &&
					<TabPane
						label="Accounts"
						count={searchResults.data.accountsTotal}
						value="accounts"
					>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>network</TableCell>
									<TableCell>account</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{searchResults.data.results.map(([network, result]) => (
									result.accounts.map((account: ItemId) => (
										<TableRow key={`${network.name}-${account.id}`}>
											<TableCell>{network.name}</TableCell>
											<TableCell>
												<AccountAddress
													address={encodeAddress(account.id, network.prefix)}
													network={network}
													copyToClipboard="small"
												/>
											</TableCell>
										</TableRow>
									)
									)))}
							</TableBody>
						</Table>
					</TabPane>
				}
				{searchResults.data.extrinsicsTotal > 0 &&
					<TabPane
						label="Extrinsics"
						count={searchResults.data.extrinsicsTotal}
						value="extrinsics"
					>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>network</TableCell>
									<TableCell>extrinsic</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{searchResults.data.results.map(([network, result]) => (
									result.extrinsics.map((item: ItemId) => (
										<TableRow key={`${network.name}-${item.id}`}>
											<TableCell>{network.name}</TableCell>
											<TableCell>
												<Link to={`/${network.name}/extrinsic/${item.id}`}>
													{item.id}
												</Link>
											</TableCell>
										</TableRow>
									)
									)))}
							</TableBody>
						</Table>
					</TabPane>
				}
			</TabbedContent>
		</Card>
	);
};
