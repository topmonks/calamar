/** @jsxImportSource @emotion/react */
import React, { Children, ReactElement, useMemo } from "react";
import { Alert } from "@mui/material";
import { css } from "@emotion/react";

import { Network } from "../../model/network";
import { ItemsResponse } from "../../model/itemsResponse";
import { NetworkSearchResult } from "../../services/searchService";
import { formatNumber } from "../../utils/number";

import { ItemsTable, ItemsTableAttribute, ItemsTableAttributeProps } from "../ItemsTable";
import { Link } from "../Link";

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

interface SearchResultsTableProps<T> {
	children: SearchResultsTableChild<T>|(SearchResultsTableChild<T>|false|undefined|null)[];
	query: string;
	results: NetworkSearchResult[];
	itemsPlural: string
	getItems: (result: NetworkSearchResult) => ItemsResponse<T>;
	onPageChange?: (page: number) => void;
}

export const SearchResultsTableItemAttribute = <T extends object>(props: ItemsTableAttributeProps<T, [Network], []>) => <ItemsTableAttribute {...props} />;

interface SearchResultsTableRow<T extends object> {
	id: string;
	item: T|undefined;
	result: NetworkSearchResult;
	collapsed?: boolean;
}

export const SearchResultsTable = <T extends object>(props: SearchResultsTableProps<T>) => {
	const { children, query, results, getItems, itemsPlural } = props;

	const collapseMultiple = results.length > 1;

	const rows = useMemo(() => {
		return results.flatMap<SearchResultsTableRow<T>>((result) => {
			const items = getItems(result);

			if (collapseMultiple && (items.totalCount || items.data.length || 0) > 1) {
				return [{
					id: `${result.network.name}-0`,
					item: undefined,
					result,
					collapsed: true
				}];
			} else {
				return items.data.map((it, index) => ({
					id: `${result.network.name}-${index}`,
					item: it,
					result
				}));
			}
		}) || [];
	}, [collapseMultiple]);

	const itemAttributes = Children.map(children, (child, index) => {
		if (!child) {
			return null;
		}

		console.log("child", index, child.type === React.Fragment, child);

		const {label, colCss, render} = child.props;

		if (index === 0) {
			return (
				<ItemsTableAttribute<SearchResultsTableRow<T>>
					label={label}
					colCss={colCss}
					colSpan={({result, collapsed}) => (collapsed /* TODO || result.error*/) ? Children.count(children) : 1}
					render={({item, result, collapsed}) => {
						return (
							<>
								{item && render(item, result.network)}
								{collapsed && (
									<Alert severity="warning" icon={false}>
										{formatNumber(getItems(result).totalCount || 0)} {itemsPlural} found. {" "}
										<Link to={`/search?query=${query}&network=${result.network.name}`}>
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
			<ItemsTableAttribute<SearchResultsTableRow<T>>
				label={label}
				colCss={colCss}
				render={({item, result}) => {
					if (!item) {
						return null;
					}

					return render(item, result.network);
				}}
				hide={({result, collapsed}) => collapsed /* TODO || result.error*/}
			/>
		);
	}) as any;

	return (
		<ItemsTable
			data={rows}
			css={tableStyle}
			data-test="search-results-table"
		>
			<ItemsTableAttribute<SearchResultsTableRow<T>>
				label="Network"
				colCss={networkColumnStyle}
				render={({result}) => (
					<div css={networkStyle}>
						<img src={result.network.icon} css={networkIconStyle} />
						<div>{result.network.displayName}</div>
					</div>
				)}
			/>
			{itemAttributes}
		</ItemsTable>
	);
};
