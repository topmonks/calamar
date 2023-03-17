/** @jsxImportSource @emotion/react */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "@mui/material";
import { css } from "@emotion/react";
import Decimal from "decimal.js";

import { usePagination } from "../../hooks/usePagination";
import { AccountBalance } from "../../model/accountBalance";
import { SortDirection } from "../../model/sortDirection";
import { SortOrder } from "../../model/sortOrder";
import { SortProperty } from "../../model/sortProperty";
import { Resource } from "../../model/resource";
import { UsdRates } from "../../model/usdRates";
import { compareProps } from "../../utils/compare";

import { AccountAddress } from "../AccountAddress";
import { Currency } from "../Currency";
import { ErrorMessage } from "../ErrorMessage";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";

const networkStyle = css`
	display: flex;
	align-items: center;
`;

const prefixStyle = css`
	font-size: 15px;
	opacity: .75;
`;

const networkIconStyle = css`
	width: 42px;
	height: 42px;
	object-fit: contain;
	margin-right: 16px;
	float: left;
`;

type AccountBalanceWithUsdRate = AccountBalance & {
	usdRate?: Decimal
};

const SortProperties = {
	NAME: (balance: AccountBalanceWithUsdRate) => balance.network.displayName,
	PREFIX: (balance: AccountBalanceWithUsdRate) => balance.network.prefix,
	TOTAL: (balance: AccountBalanceWithUsdRate) => balance.balance && [
		// positive with usd rate first, positive without usd rate second, zero third
		balance.balance.total.greaterThan(0) ? (balance.usdRate ? 3 : 2) : 1,
		balance.balance.total.mul(balance.usdRate || 0)
	],
	FREE: (balance: AccountBalanceWithUsdRate) => balance.balance && [
		// positive with usd rate first, positive without usd rate second, zero third
		balance.balance.free.greaterThan(0) ? (balance.usdRate ? 3 : 2) : 1,
		balance.balance.free.mul(balance.usdRate || 0)
	],
	RESERVED: (balance: AccountBalanceWithUsdRate) => balance.balance && [
		// positive with usd rate first, positive without usd rate second, zero third
		balance.balance.reserved.greaterThan(0) ? (balance.usdRate ? 3 : 2) : 1,
		balance.balance.reserved.mul(balance.usdRate || 0)
	],
};

export type AccountBalanceOverview = {
	balances: Resource<AccountBalance[]>;
	usdRates: Resource<UsdRates>;
}

const AccountBalancesTableAttribute = ItemsTableAttribute<AccountBalance, SortProperty<AccountBalance>, [UsdRates]>;

export const AccountBalancesTable = (props: AccountBalanceOverview) => {
	const { balances, usdRates } = props;

	const [sort, setSort] = useState<SortOrder<SortProperty<AccountBalanceWithUsdRate>>>({
		property: SortProperties.TOTAL,
		direction: SortDirection.DESC
	});

	const pagination = usePagination();

	const data = useMemo(() => {
		return balances.data
			?.map(it => ({
				...it,
				usdRate: usdRates.data?.[it.network.name]
			}))
			.sort((a, b) =>
				compareProps(a, b, sort.property, sort.direction)
					|| compareProps(a, b, SortProperties.NAME, SortDirection.ASC)
			) || [];
	}, [balances, usdRates, sort]);

	const pageData = useMemo(() => {
		return data?.slice(pagination.offset, pagination.offset + pagination.limit);
	}, [data, pagination.offset, pagination.limit]);

	useEffect(() => {
		if (data) {
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
				additionalData={[usdRates.data]}
				loading={balances.loading || usdRates.loading}
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
						<div css={networkStyle}>
							<img src={balance.network.icon} css={networkIconStyle} />
							<div>
								<div>{balance.network.displayName}</div>
								{balance.encodedAddress &&
									<>
										<div>
											<AccountAddress
												address={balance.encodedAddress}
												network={balance.network.name}
												prefix={balance.network.prefix}
												icon={false}
												shorten
												copyToClipboard="small"
											/>
										</div>
										<div css={prefixStyle}>prefix: {balance.network.prefix}</div>
									</>
								}
							</div>
						</div>
					)}
				/>
				<AccountBalancesTableAttribute
					label="Total"
					sortable
					sortProperty={SortProperties.TOTAL}
					startDirection={SortDirection.DESC}
					onSortChange={handleSortSelected}
					render={(balance, usdRates) => (
						<>
							{balance.balanceSupported && !balance.error && balance.balance &&
								<Currency
									amount={balance.balance.total}
									currency={balance.network.symbol}
									decimalPlaces="optimal"
									usdRate={usdRates[balance.network.name]}
									showFullInTooltip
									showUsdValue
								/>
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
					render={(balance, usdRates) => balance.balance &&
						<Currency
							amount={balance.balance.free}
							currency={balance.network.symbol}
							decimalPlaces="optimal"
							usdRate={usdRates[balance.network.name]}
							showFullInTooltip
							showUsdValue
						/>
					}
					hide={(balance) => !balance.balanceSupported || balance.error}
				/>
				<AccountBalancesTableAttribute
					label="Reserved"
					sortable
					sortProperty={SortProperties.RESERVED}
					startDirection={SortDirection.DESC}
					onSortChange={handleSortSelected}
					render={(balance, usdRates) => balance.balance &&
						<Currency
							amount={balance.balance.reserved}
							currency={balance.network.symbol}
							decimalPlaces="optimal"
							usdRate={usdRates[balance.network.name]}
							showFullInTooltip
							showUsdValue
						/>
					}
					hide={(balance) => !balance.balanceSupported || balance.error}
				/>
			</ItemsTable>
		</div>
	);
};
