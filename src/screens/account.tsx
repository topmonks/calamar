/** @jsxImportSource @emotion/react */
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { css } from "@emotion/react";
import { AccountAvatar } from "../components/AccountAvatar";
import { Card, CardHeader } from "../components/Card";
import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";
import { TabbedContent, TabPane } from "../components/TabbedContent";
import { useExtrinsics } from "../hooks/useExtrinsics";
import { AccountInfoTable } from "../components/account/AccountInfoTable";
import { useAccount } from "../hooks/useAccount";
import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";

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

	const extrinsics = useExtrinsics(network, {
		OR: [
			{ signature_jsonContains: `{"address": "${address}" }` },
			{ signature_jsonContains: `{"address": { "value": "${address}"} }` },
		],
	});

	useDOMEventTrigger("data-loaded", !account.loading && !extrinsics.loading);

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
				<AccountInfoTable network={network} account={account} />
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
					</TabbedContent>
				</Card>
			}
		</>
	);
}

export default AccountPage;
