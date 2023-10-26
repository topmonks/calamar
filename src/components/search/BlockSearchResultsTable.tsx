import { Block } from "../../model/block";
import { ItemsResponse } from "../../model/itemsResponse";
import { SearchResultItem } from "../../model/searchResultItem";

import { AccountAddress } from "../AccountAddress";
import { Link } from "../Link";
import { Time } from "../Time";

import { SearchResultsTable, SearchResultsTableItemAttribute } from "./SearchResultsTable";

export interface BlockSearchResultsTable {
	query: string;
	items: ItemsResponse<SearchResultItem<Block>, true>;
	onPageChange?: (page: number) => void;
}

export const BlockSearchResultsTable = (props: BlockSearchResultsTable) => {
	const {query, items, onPageChange} = props;

	return (
		<SearchResultsTable<Block>
			query={query}
			items={items}
			itemsPlural="blocks"
			onPageChange={onPageChange}
		>
			<SearchResultsTableItemAttribute<Block>
				label="Block (Height)"
				render={(block) =>
					<Link to={`/${block.network.name}/block/${block.id}`}>
						{block.height}
					</Link>
				}
			/>
			<SearchResultsTableItemAttribute<Block>
				label="Spec version"
				render={(block) =>
					<>{block.specVersion}</>
				}
			/>
			<SearchResultsTableItemAttribute<Block>
				label="Validator"
				render={(block) =>
					block.validator &&
						<AccountAddress
							network={block.network}
							address={block.validator}
							shorten
							copyToClipboard="small"
						/>
				}
			/>
			<SearchResultsTableItemAttribute<Block>
				label="Time"
				render={(block) =>
					<Time time={block.timestamp} fromNow tooltip utc />
				}
			/>
		</SearchResultsTable>
	);
};
