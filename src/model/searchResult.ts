import { ItemsResponse } from "./itemsResponse";
import { SearchResultItem } from "./searchResultItem";

import { Account } from "./account";
import { Block } from "./block";
import { Event } from "./event";
import { Extrinsic } from "./extrinsic";

export type SearchResult = {
	accountItems: ItemsResponse<SearchResultItem<Account>, true>
	blockItems: ItemsResponse<SearchResultItem<Block>, true>
	extrinsicItems: ItemsResponse<SearchResultItem<Extrinsic>, true>
	eventItems: ItemsResponse<SearchResultItem<Event>, true>
	accountsTotalCount: number;
	blocksTotalCount: number;
	extrinsicsTotalCount: number;
	eventsTotalCount: number;
	totalCount: number;
}
