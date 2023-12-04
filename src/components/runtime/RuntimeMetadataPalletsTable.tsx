import { useMemo } from "react";

import { Network } from "../../model/network";
import { PaginatedResource } from "../../model/paginatedResource";
import { RuntimeMetadataPallet } from "../../model/runtime-metadata/runtimeMetadataPallet";

import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";

export type ExtrinsicsTableProps = {
	network: Network;
	specVersion: string;
	pallets: PaginatedResource<RuntimeMetadataPallet>,
};

const RuntimeMetadataPalletsTableAttribute = ItemsTableAttribute<RuntimeMetadataPallet>;

export function RuntimeMetadataPalletsTable(props: ExtrinsicsTableProps) {
	const { network, specVersion, pallets } = props;

	const data = useMemo(() => pallets.data?.map(it => ({id: it.name, ...it})), [pallets]);

	return (
		<ItemsTable
			data={data}
			loading={pallets.loading}
			notFound={pallets.notFound}
			notFoundMessage="No extrinsics found"
			error={pallets.error}
			data-test="runtime-metadata-pallets-items"
		>
			<RuntimeMetadataPalletsTableAttribute
				label="Pallet"
				render={(pallet) =>
					<Link to={`/${network.name}/runtime/${specVersion}/${pallet.name.toLowerCase()}`}>{pallet.name}</Link>
				}
			/>
			<RuntimeMetadataPalletsTableAttribute
				label="Calls"
				render={(data) => data.callsCount}
			/>
			<RuntimeMetadataPalletsTableAttribute
				label="Events"
				render={(data) => data.eventsCount}
			/>
			<RuntimeMetadataPalletsTableAttribute
				label="Constants"
				render={(data) => data.constantsCount}
			/>
		</ItemsTable>
	);
}
