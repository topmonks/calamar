import { Block } from "../../model/block";
import { PaginatedResource } from "../../model/paginatedResource";
import { SearchResultItem } from "../../model/searchResultItem";

import { AccountAddress } from "../account/AccountAddress";
import { BlockLink } from "../blocks/BlockLink";
import { Link } from "../Link";

import { Time } from "../Time";

import { SearchResultsTable, SearchResultsTableItemAttribute, SearchResultsTableProps } from "./SearchResultsTable";

export interface BlockSearchResultsTable
	extends Pick<SearchResultsTableProps<Block>, "query" | "onPageChange"> {
	blocks: PaginatedResource<SearchResultItem<Block>>;
}

export const BlockSearchResultsTable = (props: BlockSearchResultsTable) => {
	const {blocks, ...tableProps} = props;

	return (
		<SearchResultsTable<Block>
			data={blocks.data}
			loading={blocks.loading}
			pageInfo={blocks.pageInfo}
			notFound={blocks.notFound}
			error={blocks.error}
			itemsPlural="blocks"
			data-test="blocks-items"
			{...tableProps}
		>
			<SearchResultsTableItemAttribute<Block>
				label="Block (Height)"
				render={(block) =>
					<BlockLink network={block.network} id={block.id} />
				}
			/>
			<SearchResultsTableItemAttribute<Block>
				label="Spec version"
				render={(block) =>
					<Link to={`/${block.network.name}/runtime/${block.specVersion}`}>
						{block.specVersion}
					</Link>
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
