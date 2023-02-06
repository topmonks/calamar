/** @jsxImportSource @emotion/react */
import { useMemo, useState } from "react";
import { Alert } from "@mui/material";

import { AccountBalance } from "../../model/accountBalance";
import { Resource } from "../../model/resource";
import { getNetwork } from "../../services/networksService";

import { AccountAddress } from "../AccountAddress";
import { ErrorMessage } from "../ErrorMessage";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import Loading from "../Loading";

enum AccountBalanceTableSortOrder {
	BALANCE,
	PREFIX
}

export type AccountBalanceOverview = {
	balances: Resource<AccountBalance[]>;
}

function compareBalanceStatus(a: AccountBalance, b: AccountBalance) {
	const aRank = !a.balanceSupported ? 3 : a.error ? 2 : 1;
	const bRank = !b.balanceSupported ? 3 : b.error ? 2 : 1;
	return aRank - bRank;
}

const AccountBalancesTableAttribute = ItemsTableAttribute<AccountBalance>;

export const AccountBalancesTable = (props: AccountBalanceOverview) => {
	const { balances } = props;

	const [order, setOrder] = useState<AccountBalanceTableSortOrder>(AccountBalanceTableSortOrder.BALANCE);

	const data = useMemo(() => {
		return [...(balances.data || [])].sort((a, b) => {
			return compareBalanceStatus(a, b)
				|| (b.balance?.total || 0) - (a.balance?.total || 0);
		});

	}, [balances.data, order]);

	if (balances.loading) {
		return <Loading />;
	}

	if (balances.error) {
		return (
			<ErrorMessage
				message="Unexpected error occured while fetching data"
				details={balances.error.message}
				showReported
			/>
		);
	}

	return (
		<div>
			<ItemsTable
				data={data}
				loading={balances.loading}
				error={balances.error}
				data-test="account-balances-table"
			>
				<AccountBalancesTableAttribute
					label="Network"
					render={(balance) => (
						<div>
							<div>{getNetwork(balance.network)?.displayName}</div>
							{balance.encodedAddress && Number.isInteger(balance.ss58prefix) &&
								<div>
									<AccountAddress
										address={balance.encodedAddress}
										network={balance.network}
										prefix={balance.ss58prefix!}
										icon={false}
										shorten
									/> (prefix: {balance.ss58prefix})
								</div>
							}
						</div>
					)}
				/>
				<AccountBalancesTableAttribute
					label="Total"
					render={(balance) => (
						<>
							{balance.balanceSupported && !balance.error && (balance.balance?.total || 0)}
							{!balance.balanceSupported &&
								<Alert severity="warning">
									Account balance for this network is not currently supported.
								</Alert>
							}
							{balance.error &&
								<ErrorMessage
									message="Unexpected error occured while fetching data"
									details={balance.error.message}
								/>
							}
						</>
					)}
					colSpan={(balance) => (!balance.balanceSupported || balance.error) ? 3 : 1}
				/>
				<AccountBalancesTableAttribute
					label="Free"
					render={(balance) => balance.balance?.free || 0}
					hide={(balance) => !balance.balanceSupported || balance.error}
				/>
				<AccountBalancesTableAttribute
					label="Reserved"
					render={(balance) => balance.balance?.reserved || 0}
					hide={(balance) => !balance.balanceSupported || balance.error}
				/>
			</ItemsTable>
		</div>
	);
};
