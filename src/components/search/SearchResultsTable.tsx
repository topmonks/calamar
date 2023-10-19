/** @jsxImportSource @emotion/react */
import { Children, ReactElement, ReactNode } from "react";
import { css } from "@emotion/react";

import { NetworkSearchResult } from "../../services/searchService";

import { ItemsTable, ItemsTableAttribute, ItemsTableAttributeProps } from "../ItemsTable";
import { Link } from "../Link";
import { Alert } from "@mui/material";
import { formatNumber } from "../../utils/number";
import { ButtonLink } from "../ButtonLink";
import { Time } from "../Time";
import { Network } from "../../model/network";
import { Extrinsic } from "../../model/extrinsic";
import { ItemsResponse } from "../../model/itemsResponse";
import React from "react";

const tableStyle = css`
	table {
		table-layout: auto;
	}
`;

const networkColumnStyle = css`
	width: 0px;
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
	getItems: (result: NetworkSearchResult) => ItemsResponse<T>;
	itemsPlural: string
}

export const SearchResultsTableAttribute = <T extends object>(props: ItemsTableAttributeProps<{item: T, result: NetworkSearchResult}, [Network], []>) => <ItemsTableAttribute {...props} />;
export const SearchResultsTableItemAttribute = <T extends object>(props: ItemsTableAttributeProps<T, [Network], []>) => <ItemsTableAttribute {...props} />;

interface SearchResultsTableRow<T extends object> {
	id: string;
	item: T|undefined;
	result: NetworkSearchResult;
}

export const SearchResultsTable = <T extends object>(props: SearchResultsTableProps<T>) => {
	const { children, query, results, getItems, itemsPlural } = props;

	const rows = results.flatMap<SearchResultsTableRow<T>>((result) => {
		const items = getItems(result);

		if (items.data.length === 0 && items.totalCount) {
			return [{
				id: `${result.network.name}-0`,
				item: undefined,
				result
			}];
		} else {
			return items.data.map((it, index) => ({
				id: `${result.network.name}-${index}`,
				item: it,
				result
			}));
		}
	}) || [];

	const itemAttributes = Children.map(children, (child, index) => {
		if (!child) {
			return null;
		}

		console.log("child", index, child.type === React.Fragment, child);

		const {label, colCss, render} = child.props;

		if (index === 0) {
			return (
				<SearchResultsTableAttribute<T>
					label={label}
					colCss={colCss}
					colSpan={({item, result}) => (!item /* TODO || result.error*/) ? Children.count(children) : 1}
					render={({item, result}) => {
						const total = getItems(result).totalCount || 0;

						return (
							<>
								{item && render(item, result.network)}
								{!item && (
									<Alert severity="warning" icon={false}>
										{formatNumber(total)} {itemsPlural} found. {" "}
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
			<SearchResultsTableAttribute<T>
				label={label}
				colCss={colCss}
				render={({item, result}) => {
					if (!item) {
						return null;
					}

					return render(item, result.network);
				}}
				hide={({item, result}) => !item /* TODO || result.error*/}
			/>
		);
	}) as any;

	return (
		<ItemsTable
			//data={results.map(it => ({...it, id: it.network.name})).filter(it => (getItems(it).pagination.totalCount || 0) > 0)}
			data={rows}
			css={tableStyle}
			data-test="search-results-table"
		>
			<SearchResultsTableAttribute
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
