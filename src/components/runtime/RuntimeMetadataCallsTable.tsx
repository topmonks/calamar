/** @jsxImportSource @emotion/react */
import { useMemo } from "react";
import { css } from "@emotion/react";

import { Network } from "../../model/network";
import { PaginatedResource } from "../../model/paginatedResource";
import { RuntimeMetadataCall } from "../../model/runtime-metadata/runtimeMetadataCall";

import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";

import { RuntimeMetadataDescription } from "./RuntimeMetadataDescription";

const nameColStyle = css`
	width: 25%;
`;

const parametersColStyle = css`
	width: 25%;
`;

export type ExtrinsicsTableProps = {
	network: Network,
	specVersion: string,
	palletName: string,
	calls: PaginatedResource<RuntimeMetadataCall>,
};

const RuntimeMetadataCallsTableAttribute = ItemsTableAttribute<RuntimeMetadataCall>;

export function RuntimeMetadataCallsTable(props: ExtrinsicsTableProps) {
	const { network, specVersion, palletName, calls } = props;

	const data = useMemo(() => calls.data?.map(it => ({id: it.name, ...it})), [calls]);

	return (
		<ItemsTable
			data={data}
			loading={calls.loading}
			notFound={calls.notFound}
			notFoundMessage="No extrinsics found"
			error={calls.error}
			data-test="calls-items"
		>
			<RuntimeMetadataCallsTableAttribute
				label="Call"
				colCss={nameColStyle}
				render={(data) =>
					<Link to={`/${network.name}/runtime/${specVersion}/${palletName.toLowerCase()}/calls/${data.name.toLowerCase()}`}>
						{data.name}
					</Link>
				}
			/>
			<RuntimeMetadataCallsTableAttribute
				label="Parameters"
				colCss={parametersColStyle}
				render={(data) => data.args.length}
			/>
			<RuntimeMetadataCallsTableAttribute
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
