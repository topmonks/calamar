/** @jsxImportSource @emotion/react */
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { css } from "@emotion/react";

import { AccountAvatar } from "../components/AccountAvatar";
import { CallsTable } from "../components/calls/CallsTable";
import { Card, CardHeader } from "../components/Card";
import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";
import { TabbedContent, TabPane } from "../components/TabbedContent";
import { AccountInfoTable } from "../components/account/AccountInfoTable";
import { useAccount } from "../hooks/useAccount";
import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";
import { useExtrinsics } from "../hooks/useExtrinsics";
import { useCalls } from "../hooks/useCalls";
import { hasSupport } from "../services/networksService";
import TransfersTable from "../components/transfers/TransfersTable";
import { useTransfers } from "../hooks/useTransfers";

const avatarStyle = css`
	vertical-align: text-bottom;
	margin-right: 8px;
`;

type AccountPageParams = {
	network: string;
	address: string;
};

function AccountPage() {
	const { network, address } = useParams() as AccountPageParams;

	const account = useAccount(network, address);
	const extrinsics = useExtrinsics(network, { signerPublicKey_eq: address });
	const calls = useCalls(network, { callerPublicKey_eq: address });
	const transfers = useTransfers(network, { account: { publicKey_eq: address}});
	
	useDOMEventTrigger("data-loaded", !account.loading && !extrinsics.loading && !calls.loading);

	useEffect(() => {
		if (extrinsics.pagination.offset === 0) {
			const interval = setInterval(extrinsics.refetch, 3000);
			return () => clearInterval(interval);
		}
	}, [extrinsics]);

	return (
		<>
			<Card>
				<CardHeader>
					{account.data &&
						<AccountAvatar address={address} size={32} css={avatarStyle} />
					}
					Account #{address}
				</CardHeader>
				<AccountInfoTable
					network={network}
					account={account}
				/>
			</Card>
			{account.data &&
				<Card>
					<TabbedContent>
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

