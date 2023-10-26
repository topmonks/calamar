/** @jsxImportSource @emotion/react */
import React, { Children, ReactElement, useMemo } from "react";
import { Alert } from "@mui/material";
import { css } from "@emotion/react";

import { Network } from "../../model/network";
import { ItemsResponse } from "../../model/itemsResponse";
import { formatNumber } from "../../utils/number";

import { ItemsTable, ItemsTableAttribute, ItemsTableAttributeProps } from "../ItemsTable";
import { Link } from "../Link";
import { SearchResultItem } from "../../model/searchResultItem";

const tableStyle = css`
`;

const networkColumnStyle = css`
	width: 250px;
`;

const networkStyle = css`
	display: flex;
	align-items: center;
	margin-right: 80px;

	white-space: nowrap;
`;

const networkIconStyle = css`
	width: 20px;
	height: 20px;
	object-fit: contain;
	margin-right: 16px;
	float: left;
`;

type SearchResultsTableChild<T> = ReactElement<ItemsTableAttributeProps<T, [Network], []>>;


export const SearchResultsTableItemAttribute = <T extends object>(props: ItemsTableAttributeProps<T, [], []>) => <ItemsTableAttribute {...props} />;

export interface SearchResultsTableProps<T> {
	children: SearchResultsTableChild<T>|(SearchResultsTableChild<T>|false|undefined|null)[];
	query: string;
	items: ItemsResponse<SearchResultItem<T>, true>;
	itemsPlural: string
	onPageChange?: (page: number) => void;
}

export const SearchResultsTable = <T extends {id: string, network: Network}>(props: SearchResultsTableProps<T>) => {
	const { children, query, items, itemsPlural, onPageChange } = props;

	const data = useMemo(() => items.data.map(it => ({
		...it,
		id: `${it.network.name}-${it.data?.id || "grouped"}`
	})), [items]);

	const itemAttributes = useMemo(() => Children.map(children, (child, index) => {
		if (!child) {
			return null;
		}

		console.log("child", index, child.type === React.Fragment, child);

		const {label, colCss, render} = child.props;

		if (index === 0) {
			return (
				<ItemsTableAttribute<SearchResultItem<T>>
					label={label}
					colCss={colCss}
					colSpan={(item) => (item.groupedCount /* TODO || item.error*/) ? Children.count(children) : 1}
					render={(item) => {
						return (
							<>
								{item.data && render(item.data, item.network)}
								{item.groupedCount && (
									<Alert severity="warning" icon={false}>
										{formatNumber(item.groupedCount)} {itemsPlural} found. {" "}
										<Link to={`/search?query=${query}&network=${item.network.name}`}>
											View
										</Link>
									</Alert>
								)}
								{/* TODO result.error &&
									<ErrorMessage
										message="Unexpected error occured while fetching data"
										details={result.error.message}
										data-test={`${result.network.name}-balance-error`}
									/>
								*/}
							</>
						);
					}}
				/>
			);
		}

		return (
			<ItemsTableAttribute<SearchResultItem<T>>
				label={label}
				colCss={colCss}
				render={(item) => {
					if (!item.data) {
						return null;
					}

					return render(item.data, item.network);
				}}
				hide={(item) => !!item.groupedCount /* TODO || result.error*/}
			/>
		);
	}) as any, [children, query, itemsPlural]);

	return (
		<ItemsTable
			data={data}
			css={tableStyle}
			notFound={items.totalCount === 0}
			pageInfo={items.pageInfo}
			onPageChange={onPageChange}
			data-test="search-results-table"
		>
			<ItemsTableAttribute<SearchResultItem<T>>
				label="Network"
				colCss={networkColumnStyle}
				render={(item) => (
					<div css={networkStyle}>
						<img src={item.network.icon} css={networkIconStyle} />
						<div>{item.network.displayName}</div>
					</div>
				)}
			/>
			{itemAttributes}
		</ItemsTable>
	);
};
