import { Account } from "../../model/account";
import { ItemsResponse } from "../../model/itemsResponse";
import { PaginatedResource } from "../../model/paginatedResource";
import { SearchResultItem } from "../../model/searchResultItem";
import { encodeAddress } from "../../utils/address";

import { AccountAddress } from "../account/AccountAddress";

import { SearchResultsTable, SearchResultsTableItemAttribute, SearchResultsTableProps } from "./SearchResultsTable";

export interface AccountSearchResultsTable
	extends Pick<SearchResultsTableProps<Account>, "query" | "onPageChange"> {
	accounts: PaginatedResource<SearchResultItem<Account>>;
}

export const AccountSearchResultsTable = (props: AccountSearchResultsTable) => {
	const {accounts, ...tableProps} = props;

	return (
		<SearchResultsTable<Account>
			data={accounts.data}
			loading={accounts.loading}
			pageInfo={accounts.pageInfo}
			notFound={accounts.notFound}
			error={accounts.error}
			itemsPlural="accounts"
			{...tableProps}
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
