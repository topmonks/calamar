import { Extrinsic } from "../../model/extrinsic";
import { ItemsResponse } from "../../model/itemsResponse";
import { SearchResultItem } from "../../model/searchResultItem";

import { AccountAddress } from "../AccountAddress";
import { ButtonLink } from "../ButtonLink";
import { Link } from "../Link";
import { Time } from "../Time";

import { SearchResultsTable, SearchResultsTableItemAttribute } from "./SearchResultsTable";

export interface ExtrinsicSearchResultsTable {
	query: string;
	items: ItemsResponse<SearchResultItem<Extrinsic>, true>;
	onPageChange?: (page: number) => void;
}

export const ExtrinsicSearchResultsTable = (props: ExtrinsicSearchResultsTable) => {
	const {query, items, onPageChange} = props;

	return (
		<SearchResultsTable<Extrinsic>
			query={query}
			items={items}
			itemsPlural="extrinsics"
			onPageChange={onPageChange}
		>
			<SearchResultsTableItemAttribute<Extrinsic>
				label="Extrinsic (ID)"
				render={(extrinsic) => (
					<Link to={`/${extrinsic.network.name}/extrinsic/${extrinsic.id}`}>
						{extrinsic.id}
					</Link>
				)}
			/>
			<SearchResultsTableItemAttribute<Extrinsic>
				label="Name"
				render={(extrinsic) => (
					<ButtonLink
						to={`/${extrinsic.network.name}/search?query=${extrinsic.palletName}.${extrinsic.callName}`}
						size="small"
						color="secondary"
					>
						{extrinsic.palletName}.{extrinsic.callName}
					</ButtonLink>
				)}
			/>
			<SearchResultsTableItemAttribute<Extrinsic>
				label="Account"
				render={(extrinsic) =>
					extrinsic.signer && (
						<AccountAddress
							network={extrinsic.network}
							address={extrinsic.signer}
							shorten
							copyToClipboard="small"
						/>
					)
				}
			/>
			<SearchResultsTableItemAttribute<Extrinsic>
				label="Time"
				render={(extrinsic) => (
					<Time time={extrinsic.timestamp} fromNow tooltip utc />
				)}
			/>
		</SearchResultsTable>
	);
};
