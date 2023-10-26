import { Account } from "../../model/account";
import { ItemsResponse } from "../../model/itemsResponse";
import { SearchResultItem } from "../../model/searchResultItem";
import { encodeAddress } from "../../utils/address";

import { AccountAddress } from "../AccountAddress";

import { SearchResultsTable, SearchResultsTableItemAttribute } from "./SearchResultsTable";

export interface AccountSearchResultsTable {
	query: string;
	items: ItemsResponse<SearchResultItem<Account>, true>;
	onPageChange?: (page: number) => void;
}

export const AccountSearchResultsTable = (props: AccountSearchResultsTable) => {
	const {query, items, onPageChange} = props;

	return (
		<SearchResultsTable<Account>
			query={query}
			items={items}
			itemsPlural="accounts"
			onPageChange={onPageChange}
		>
			<SearchResultsTableItemAttribute<Account>
				label="Account"
				render={(account) => (
					<AccountAddress
						address={encodeAddress(account.id, account.network.prefix)}
						network={account.network}
						copyToClipboard="small"
					/>
				)}
			/>
		</SearchResultsTable>
	);
};
