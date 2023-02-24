/** @jsxImportSource @emotion/react */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "@mui/material";

import { usePagination } from "../../hooks/usePagination";
import { AccountBalance } from "../../model/accountBalance";
import { SortDirection } from "../../model/sortDirection";
import { SortOrder } from "../../model/sortOrder";
import { SortProperty } from "../../model/sortProperty";
import { Resource } from "../../model/resource";
import { getNetwork } from "../../services/networksService";
import { compareProps } from "../../utils/compare";

import { AccountAddress } from "../AccountAddress";
import { Currency } from "../Currency";
import { ErrorMessage } from "../ErrorMessage";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";

const SortProperties: Record<string, SortProperty<AccountBalance>> = {
	NAME: (balance: AccountBalance) => getNetwork(balance.network)?.displayName,
	PREFIX: (balance: AccountBalance) => balance.ss58prefix,
	TOTAL: (balance: AccountBalance) => balance.balance?.total, // TODO sort by USD value
	FREE: (balance: AccountBalance) => balance.balance?.free, // TODO sort by USD value
	RESERVED: (balance: AccountBalance) => balance.balance?.reserved // TODO sort by USD value
};

export type AccountBalanceOverview = {
	balances: Resource<AccountBalance[]>;
}

const AccountBalancesTableAttribute = ItemsTableAttribute<AccountBalance, SortProperty<AccountBalance>>;

export const AccountBalancesTable = (props: AccountBalanceOverview) => {
	const { balances } = props;

	const [sort, setSort] = useState<SortOrder<SortProperty<AccountBalance>>>({
		property: SortProperties.NAME,
		direction: SortDirection.ASC
	});

	const pagination = usePagination();

	const data = useMemo(() => {
		return [...(balances.data || [])]
			.sort((a, b) =>
				compareProps(a, b, sort.property, sort.direction)
					|| compareProps(a, b, SortProperties.NAME, SortDirection.ASC)
			);
	}, [balances.data, sort]);

	const pageData = useMemo(() => {
		return data?.slice(pagination.offset, pagination.offset + pagination.limit);
	}, [data, pagination.offset, pagination.limit]);

	useEffect(() => {
		if (data) {
			console.log("set pagination", {
				...pagination,
				hasNextPage: pagination.offset + pagination.limit < data.length
			});
			console.log(pagination.offset + pagination.limit, data.length);
			pagination.set({
				...pagination,
				hasNextPage: pagination.offset + pagination.limit < data.length
			});
		}
	}, [data, pagination.offset, pagination.limit]);

	const handleSortSelected = useCallback((value: SortOrder<SortProperty<AccountBalance>>) => {
		console.log("set sort", value);
		setSort(value);
		pagination.set({
			...pagination,
			offset: 0
		});
	}, [pagination]);

	return (
		<div>
			<ItemsTable
				data={pageData}
				loading={balances.loading}
				error={balances.error}
				pagination={pagination}
				sort={sort}
				data-test="account-balances-table"
			>
				<AccountBalancesTableAttribute
					label="Network"
					sortable
					sortOptions={[
						{value: {property: SortProperties.NAME, direction: SortDirection.ASC}, label: "Name"},
						{value: {property: SortProperties.NAME, direction: SortDirection.DESC}, label: "Name"},
						{value: {property: SortProperties.PREFIX, direction: SortDirection.ASC}, label: "Prefix"},
						{value: {property: SortProperties.PREFIX, direction: SortDirection.DESC}, label: "Prefix"}
					]}
					onSortChange={handleSortSelected}
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
					sortable
					sortProperty={SortProperties.TOTAL}
					startDirection={SortDirection.DESC}
					onSortChange={handleSortSelected}
					render={(balance) => (
						<>
							{balance.balanceSupported && !balance.error && balance.balance &&
								<Currency amount={balance.balance.total} symbol={balance.chainToken} />
							}
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
					sortable
					sortProperty={SortProperties.FREE}
					startDirection={SortDirection.DESC}
					onSortChange={handleSortSelected}
					render={(balance) => balance.balance &&
						<Currency amount={balance.balance.free} symbol={balance.chainToken} />
					}
					hide={(balance) => !balance.balanceSupported || balance.error}
				/>
				<AccountBalancesTableAttribute
					label="Reserved"
					sortable
					sortProperty={SortProperties.RESERVED}
					startDirection={SortDirection.DESC}
					onSortChange={handleSortSelected}
					render={(balance) => balance.balance &&
						<Currency amount={balance.balance.reserved} symbol={balance.chainToken} />
					}
					hide={(balance) => !balance.balanceSupported || balance.error}
				/>
			</ItemsTable>
		</div>
	);
};
