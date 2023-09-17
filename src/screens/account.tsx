/** @jsxImportSource @emotion/react */
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import { css, Theme } from "@emotion/react";

import { AccountAvatar } from "../components/AccountAvatar";
import { AccountBalancesTable } from "../components/account/AccountBalancesTable";
import { AccountIdentityInfo } from "../components/account/AccountIdentityInfo";
import { AccountInfoTable } from "../components/account/AccountInfoTable";
import { AccountPortfolio } from "../components/account/AccountPortfolio";
import { CallsTable } from "../components/calls/CallsTable";
import { Card, CardHeader, CardRow } from "../components/Card";
import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";
import { TabbedContent, TabPane } from "../components/TabbedContent";
import TransfersTable from "../components/transfers/TransfersTable";

import { useAccount } from "../hooks/useAccount";
import { useAccountBalances } from "../hooks/useAccountBalances";
import { useCalls } from "../hooks/useCalls";
import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";
import { useExtrinsics } from "../hooks/useExtrinsics";
import { useUsdRates } from "../hooks/useUsdRates";
import { useTransfers } from "../hooks/useTransfers";
import { useNetworkLoaderData } from "../hooks/useRootLoaderData";

import { hasSupport } from "../services/networksService";

const accountInfoStyle = css`
	display: flex;
	flex-direction: column;
`;

const accountInfoTableStyle = css`
	&:not(:last-of-type) {
		margin-bottom: 56px;
	}
`;

const accountIdentityInfoStyle = css`
	margin-top: auto;
`;

const avatarStyle = css`
	vertical-align: text-bottom;
	margin-left: 12px;
`;

const accountLabel = css`
	margin-left: 8px;
	font-weight: 400;
`;

const accountLabelName = css`
`;

const accountLabelAddress = css`
	opacity: .5;
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

export type AccountPageParams = {
	address: string;
};

export const AccountPage = () => {
	const { network } = useNetworkLoaderData();
	const { address } = useParams() as AccountPageParams;

	const account = useAccount(network.name, address);
	const balances = useAccountBalances(address);
	const extrinsics = useExtrinsics(network.name, { signerAddress_eq: address });
	const calls = useCalls(network.name, { callerAddress_eq: address });
	const transfers = useTransfers(network.name, { accountAddress_eq: address });

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
				<Card css={accountInfoStyle} data-test="account-info">
					<CardHeader>
						Account
						{(account.loading || account.data) &&
							<AccountAvatar address={address} size={32} css={avatarStyle} />
						}
						<span css={accountLabel}>
							{account.data?.identity?.display
								? <span css={accountLabelName}>{account.data?.identity?.display}</span>
								: <span css={accountLabelAddress}>{address}</span>
							}
						</span>
					</CardHeader>
					<AccountInfoTable
						css={accountInfoTableStyle}
						network={network}
						account={account}
					/>
					<AccountIdentityInfo
						css={accountIdentityInfoStyle}
						account={account}
					/>
				</Card>
				<Card css={portfolioStyle} data-test="account-portfolio">
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
				<Card data-test="account-related-items">
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
						{hasSupport(network.name, "explorer-squid") &&
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
						{hasSupport(network.name, "main-squid") &&
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
};
