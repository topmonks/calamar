/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import { PaginatedResource } from "../../model/paginatedResource";
import { Resource } from "../../model/resource";
import { RuntimeSpec } from "../../model/runtimeSpec";
import { getEventMetadataByName } from "../../utils/queryMetadata";

import { ButtonLink } from "../ButtonLink";
import DataViewer from "../DataViewer";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";

const parametersColCss = (showExtrinsic?: boolean) => css`
	width: ${showExtrinsic ? "40%" : "60%"};
`;

export type EventsTableProps = {
	network: string;
	events: PaginatedResource<any>;
	runtimeSpecs?: Resource<RuntimeSpec[]>;
	showExtrinsic?: boolean;
};

const EventsItemsTableAttribute = ItemsTableAttribute<any, [RuntimeSpec[]]>;

function EventsTable(props: EventsTableProps) {
	const { network, events, runtimeSpecs, showExtrinsic } = props;

	return (
		<ItemsTable
			data={events.data}
			additionalData={[runtimeSpecs?.data]}
			loading={events.loading || runtimeSpecs?.loading}
			notFound={events.notFound}
			notFoundMessage="No events found"
			error={events.error}
			pagination={events.pagination}
			data-test="events-table"
		>
			<ItemsTableAttribute
				label="ID"
				render={(event) => (
					<Link to={`/${network}/event/${event.id}`}>
						{event.id}
					</Link>
				)}
			/>
			<ItemsTableAttribute
				label="Name"
				render={(event) =>
					<ButtonLink
						to={`/${network}/search?query=${event.name}`}
						size="small"
						color="secondary"
					>
						{event.name}
					</ButtonLink>
				}
			/>
			{showExtrinsic && (
				<ItemsTableAttribute
					label="Extrinsic"
					render={(event) => event.extrinsic?.id && (
						<Link to={`/${network}/extrinsic/${event.extrinsic.id}`}>
							{event.extrinsic.id}
						</Link>
					)}
				/>
			)}
			<EventsItemsTableAttribute
				label="Parameters"
				colCss={parametersColCss(showExtrinsic)}
				render={(event, runtimeSpecs) => {
					if (!event.args) {
						return null;
					}

					const metadata = runtimeSpecs?.find(it => it.specVersion === event.block.spec.specVersion)?.metadata;

					return (
						<DataViewer
							network={network}
							data={event.args}
							metadata={metadata && getEventMetadataByName(metadata, event.name)?.args}
							copyToClipboard
						/>
					);
				}}
			/>
		</ItemsTable>
	);
}

export default EventsTable;
