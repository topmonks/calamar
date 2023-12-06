import { useMemo } from "react";
import { css } from "@emotion/react";

import { Network } from "../../model/network";
import { PaginatedResource } from "../../model/paginatedResource";
import { RuntimeMetadataError } from "../../model/runtime-metadata/runtimeMetadataError";

import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";

import { RuntimeMetadataDescription } from "./RuntimeMetadataDescription";

const nameColStyle = css`
	width: 25%;
`;

export type ErrorsTableProps = {
	network: Network,
	specVersion: string,
	palletName: string,
	errors: PaginatedResource<RuntimeMetadataError>,
};

const RuntimeMetadataErrorsTableAttribute = ItemsTableAttribute<RuntimeMetadataError>;

export function RuntimeMetadataErrorsTable(props: ErrorsTableProps) {
	const { network, specVersion, palletName, errors } = props;

	const data = useMemo(() => errors.data?.map(it => ({id: it.name, ...it})), [errors]);

	return (
		<ItemsTable
			data={data}
			loading={errors.loading}
			notFound={errors.notFound}
			notFoundMessage="No extrinsics found"
			error={errors.error}
			data-test="errors-items"
		>
			<RuntimeMetadataErrorsTableAttribute
				label="Error"
				colCss={nameColStyle}
				render={(data) =>
					<Link to={`/${network.name}/runtime/${specVersion}/${palletName.toLowerCase()}/errors/${data.name.toLowerCase()}`}>
						{data.name}
					</Link>
				}
			/>
			<RuntimeMetadataErrorsTableAttribute
				label="Description"
				render={(data) => (
					<RuntimeMetadataDescription lineClamp={1}>
						{data.description}
					</RuntimeMetadataDescription>
				)}
			/>
		</ItemsTable>
	);
}
