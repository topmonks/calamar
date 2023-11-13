/** @jsxImportSource @emotion/react */
import React, { Children, ReactElement, useMemo } from "react";
import { Alert } from "@mui/material";
import { css } from "@emotion/react";

import { Network } from "../../model/network";
import { SearchResultItem } from "../../model/searchResultItem";
import { formatNumber } from "../../utils/number";

import { ItemsTable, ItemsTableAttribute, ItemsTableAttributeProps, ItemsTableProps } from "../ItemsTable";
import { Link } from "../Link";
import { NetworkBadge } from "../NetworkBadge";

const tableStyle = css`
`;

const networkColumnStyle = css`
	width: 250px;
`;

const networkStyle = css`
	margin-right: 80px;
`;

type SearchResultsTableChild<T> = ReactElement<ItemsTableAttributeProps<T, [Network], []>>;


export const SearchResultsTableItemAttribute = <T extends object>(props: ItemsTableAttributeProps<T, [], []>) => <ItemsTableAttribute {...props} />;

export interface SearchResultsTableProps<T> extends Omit<ItemsTableProps<SearchResultItem<T>>, "children"> {
	children: SearchResultsTableChild<T>|(SearchResultsTableChild<T>|false|undefined|null)[];
	query: string;
	itemsPlural: string
}

export const SearchResultsTable = <T extends {id: string, network: Network}>(props: SearchResultsTableProps<T>) => {
	const { children, query, itemsPlural, ...itemsTableProps } = props;

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
			{...itemsTableProps}
			css={tableStyle}
		>
			<ItemsTableAttribute<SearchResultItem<T>>
				label="Network"
				colCss={networkColumnStyle}
				render={(item) => (
					<NetworkBadge network={item.network} css={networkStyle} />
				)}
			/>
			{itemAttributes}
		</ItemsTable>
	);
};
