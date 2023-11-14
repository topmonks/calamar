import { Extrinsic } from "../../model/extrinsic";
import { PaginatedResource } from "../../model/paginatedResource";
import { SearchResultItem } from "../../model/searchResultItem";

import { AccountAddress } from "../account/AccountAddress";

import { ButtonLink } from "../ButtonLink";
import { ExtrinsicLink } from "../extrinsics/ExtrinsicLink";
import { Link } from "../Link";
import { Time } from "../Time";

import { SearchResultsTable, SearchResultsTableItemAttribute, SearchResultsTableProps } from "./SearchResultsTable";

export interface ExtrinsicSearchResultsTable
	extends Pick<SearchResultsTableProps<Extrinsic>, "query" | "onPageChange"> {
	extrinsics: PaginatedResource<SearchResultItem<Extrinsic>>;
}

export const ExtrinsicSearchResultsTable = (props: ExtrinsicSearchResultsTable) => {
	const {extrinsics, ...tableProps} = props;

	return (
		<SearchResultsTable<Extrinsic>
			data={extrinsics.data}
			loading={extrinsics.loading}
			pageInfo={extrinsics.pageInfo}
			notFound={extrinsics.notFound}
			error={extrinsics.error}
			itemsPlural="extrinsics"
			{...tableProps}
		>
			<SearchResultsTableItemAttribute<Extrinsic>
				label="Extrinsic (ID)"
				render={(extrinsic) => (
					<ExtrinsicLink network={extrinsic.network} id={extrinsic.id} />
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
