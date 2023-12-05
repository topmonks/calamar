import { useMemo } from "react";
import { css } from "@emotion/react";

import { Network } from "../../model/network";
import { PaginatedResource } from "../../model/paginatedResource";
import { RuntimeMetadataConstant } from "../../model/runtime-metadata/runtimeMetadataConstant";

import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";

import { RuntimeMetadataDescription } from "./RuntimeMetadataDescription";

const nameColStyle = css`
	width: 25%;
`;

export type ConstantsTableProps = {
	network: Network,
	specVersion: string,
	palletName: string,
	constants: PaginatedResource<RuntimeMetadataConstant>,
};

const RuntimeMetadataConstantsTableAttribute = ItemsTableAttribute<RuntimeMetadataConstant>;

export function RuntimeMetadataConstantsTable(props: ConstantsTableProps) {
	const { network, specVersion, palletName, constants } = props;

	const data = useMemo(() => constants.data?.map(it => ({id: it.name, ...it})), [constants]);

	return (
		<ItemsTable
			data={data}
			loading={constants.loading}
			notFound={constants.notFound}
			notFoundMessage="No extrinsics found"
			error={constants.error}
			data-test="constants-items"
		>
			<RuntimeMetadataConstantsTableAttribute
				label="Constant"
				colCss={nameColStyle}
				render={(data) =>
					<Link to={`/${network.name}/runtime/${specVersion}/${palletName.toLowerCase()}/constants/${data.name.toLowerCase()}`}>
						{data.name}
					</Link>
				}
			/>
			<RuntimeMetadataConstantsTableAttribute
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
