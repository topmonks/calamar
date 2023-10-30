import { ItemsResponse } from "./itemsResponse";
import { SearchResultItem } from "./searchResultItem";

import { Account } from "./account";
import { Block } from "./block";
import { Event } from "./event";
import { Extrinsic } from "./extrinsic";

export type SearchResult = {
	accounts: ItemsResponse<SearchResultItem<Account>, true>
	blocks: ItemsResponse<SearchResultItem<Block>, true>
	extrinsics: ItemsResponse<SearchResultItem<Extrinsic>, true>
	events: ItemsResponse<SearchResultItem<Event>, true>
	totalCount: number;
}
