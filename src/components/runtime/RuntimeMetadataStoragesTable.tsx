import { useMemo } from "react";
import { css } from "@emotion/react";

import { Network } from "../../model/network";
import { PaginatedResource } from "../../model/paginatedResource";
import { RuntimeMetadataStorage } from "../../model/runtime-metadata/runtimeMetadataStorage";

import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";

import { RuntimeMetadataDescription } from "./RuntimeMetadataDescription";

const nameColStyle = css`
	width: 25%;
`;

const parametersColStyle = css`
	width: 25%;
`;

export type StoragesTableProps = {
	network: Network,
	specVersion: string,
	palletName: string,
	storages: PaginatedResource<RuntimeMetadataStorage>,
};

const RuntimeMetadataStoragesTableAttribute = ItemsTableAttribute<RuntimeMetadataStorage>;

export function RuntimeMetadataStoragesTable(props: StoragesTableProps) {
	const { network, specVersion, palletName, storages } = props;

	const data = useMemo(() => storages.data?.map(it => ({id: it.name, ...it})), [storages]);

	return (
		<ItemsTable
			data={data}
			loading={storages.loading}
			notFound={storages.notFound}
			notFoundMessage="No extrinsics found"
			error={storages.error}
			data-test="runtime-metadata-storages-items"
		>
			<RuntimeMetadataStoragesTableAttribute
				label="Storage"
				colCss={nameColStyle}
				render={(data) =>
					<Link to={`/${network.name}/runtime/${specVersion}/${palletName.toLowerCase()}/storages/${data.name.toLowerCase()}`}>
						{data.name}
					</Link>
				}
			/>
			<RuntimeMetadataStoragesTableAttribute
				label="Parameters"
				colCss={parametersColStyle}
				render={(data) => data.args?.length || 0}
			/>
			<RuntimeMetadataStoragesTableAttribute
				label="Description"
				render={(data) => (
					<RuntimeMetadataDescription onlyLine={1} ellipsis>
						{data.description}
					</RuntimeMetadataDescription>
				)}
			/>
		</ItemsTable>
	);
}
