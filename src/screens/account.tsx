/** @jsxImportSource @emotion/react */
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import { css, Theme } from "@emotion/react";

import { AccountAvatar } from "../components/AccountAvatar";
import { AccountBalancesTable } from "../components/account/AccountBalancesTable";
import { AccountInfoTable } from "../components/account/AccountInfoTable";
import { AccountPortfolio } from "../components/account/AccountPortfolio";
import { CallsTable } from "../components/calls/CallsTable";
import { Card, CardHeader, CardRow } from "../components/Card";
import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";
import { TabbedContent, TabPane } from "../components/TabbedContent";

import { useAccount } from "../hooks/useAccount";
import { useAccountBalances } from "../hooks/useAccountBalances";
import { useCalls } from "../hooks/useCalls";
import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";
import { useExtrinsics } from "../hooks/useExtrinsics";
import { useUsdRates } from "../hooks/useUsdRatesX";

import { hasSupport } from "../services/networksService";
import TransfersTable from "../components/transfers/TransfersTable";
import { useTransfers } from "../hooks/useTransfers";

import { shortenHash } from "../utils/shortenHash";

const avatarStyle = css`
	vertical-align: text-bottom;
	margin-right: 8px;
`;

const portfolioStyle = (theme: Theme) => css`
	flex: 0 0 auto;
	width: 400px;

	${theme.breakpoints.down("lg")} {
		width: auto;
	}
`;

const portfolioInfoIconStyle = css`
	height: 30px;
	font-size: 20px;
	opacity: .5;
	vertical-align: text-bottom;
	margin-left: 4px;
`;

type AccountPageParams = {
	network: string;
	address: string;
};

function AccountPage() {
	const { network, address } = useParams() as AccountPageParams;

	const account = useAccount(network, address);
	const balances = useAccountBalances(address);
	const extrinsics = useExtrinsics(network, { signerPublicKey_eq: address });
	const calls = useCalls(network, { callerPublicKey_eq: address });
	const transfers = useTransfers(network, { account: { publicKey_eq: address}});

	const usdRates = useUsdRates();

	useDOMEventTrigger("data-loaded", !account.loading && !extrinsics.loading && !calls.loading && !transfers.loading && !usdRates.loading);

	useEffect(() => {
		if (extrinsics.pagination.offset === 0) {
			const interval = setInterval(extrinsics.refetch, 3000);
			return () => clearInterval(interval);
		}
	}, [extrinsics]);

	return (
		<>
			<CardRow>
				<Card>
					<CardHeader>
						{account.data &&
							<AccountAvatar address={address} size={32} css={avatarStyle} />
						}
						Account #{shortenHash(address)}
					</CardHeader>
					<AccountInfoTable
						network={network}
						account={account}
					/>
				</Card>
				<Card css={portfolioStyle}>
					<CardHeader>
						Portfolio
						<Tooltip
							arrow
							placement="top"
							enterTouchDelay={0}
							title="Includes only supported networks with conversion rate to USD."
						>
							<InfoOutlined css={portfolioInfoIconStyle} />
						</Tooltip>
					</CardHeader>
					<AccountPortfolio
						balances={balances}
						usdRates={usdRates}
					/>
				</Card>
			</CardRow>
			{account.data &&
				<Card>
					<TabbedContent>
						<TabPane
							label="Balances"
							count={balances.data?.length}
							loading={balances.loading}
							error={balances.error}
							value="balances"
						>
							<AccountBalancesTable balances={balances} usdRates={usdRates} />
						</TabPane>
						<TabPane
							label="Extrinsics"
							count={extrinsics.pagination.totalCount}
							loading={extrinsics.loading}
							error={extrinsics.error}
							value="extrinsics"
						>
							<ExtrinsicsTable network={network} extrinsics={extrinsics} showTime />
						</TabPane>
						{hasSupport(network, "explorer-squid") &&
							<TabPane
								label="Calls"
								count={calls.pagination.totalCount}
								loading={calls.loading}
								error={calls.error}
								value="calls"
							>
								<CallsTable network={network} calls={calls} />
							</TabPane>
						}
						{hasSupport(network, "main-squid") &&
							<TabPane
								label="Transfers"
								count={transfers.pagination.totalCount}
								loading={transfers.loading}
								error={transfers.error}
								value="transfers"
							>
								<TransfersTable network={network} transfers={transfers} showTime />
							</TabPane>
						}
					</TabbedContent>
				</Card>
			}
		</>
	);
}

export default AccountPage;

