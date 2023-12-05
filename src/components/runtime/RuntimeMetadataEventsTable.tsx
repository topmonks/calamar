import { useMemo } from "react";
import { css } from "@emotion/react";

import { Network } from "../../model/network";
import { PaginatedResource } from "../../model/paginatedResource";
import { RuntimeMetadataEvent } from "../../model/runtime-metadata/runtimeMetadataEvent";

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
	events: PaginatedResource<RuntimeMetadataEvent>,
};

const RuntimeMetadataEventsTableAttribute = ItemsTableAttribute<RuntimeMetadataEvent>;

export function RuntimeMetadataEventsTable(props: ExtrinsicsTableProps) {
	const { network, specVersion, palletName, events } = props;

	const data = useMemo(() => events.data?.map(it => ({id: it.name, ...it})), [events]);

	return (
		<ItemsTable
			data={data}
			loading={events.loading}
			notFound={events.notFound}
			notFoundMessage="No extrinsics found"
			error={events.error}
			data-test="events-items"
		>
			<RuntimeMetadataEventsTableAttribute
				label="Events"
				colCss={nameColStyle}
				render={(data) =>
					<Link to={`/${network.name}/runtime/${specVersion}/${palletName.toLowerCase()}/events/${data.name.toLowerCase()}`}>
						{data.name}
					</Link>
				}
			/>
			<RuntimeMetadataEventsTableAttribute
				label="Parameters"
				colCss={parametersColStyle}
				render={(data) => data.args.length}
			/>
			<RuntimeMetadataEventsTableAttribute
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
