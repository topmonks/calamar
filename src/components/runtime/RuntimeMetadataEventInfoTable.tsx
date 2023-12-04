import { Network } from "../../model/network";
import { Resource } from "../../model/resource";
import { RuntimeMetadataEvent } from "../../model/runtime-metadata/runtimeMetadataEvent";

import { ButtonLink } from "../ButtonLink";
import { InfoTable, InfoTableAttribute } from "../InfoTable";

import { RuntimeMetadataArgsViewer } from "./RuntimeMetadataArgs";
import { RuntimeMetadataDescription } from "./RuntimeMetadataDescription";

export type EventInfoTableProps = {
	network: Network;
	event: Resource<RuntimeMetadataEvent>;
}

const RuntimeMetadataCallInfoTableAttribute = InfoTableAttribute<RuntimeMetadataEvent>;

export const RuntimeMetadataEventInfoTable = (props: EventInfoTableProps) => {
	const {network, event} = props;

	return (
		<InfoTable
			data={event.data}
			loading={event.loading}
			notFound={event.notFound}
			notFoundMessage="No call found"
			error={event.error}
		>
			<RuntimeMetadataCallInfoTableAttribute
				label="Event"
				render={(data) =>
					<ButtonLink
						to={`/search/events?query=${data.pallet}.${data.name}&network=${network.name}`}
						size="small"
						color="secondary"
					>
						{data.pallet}.{data.name}
					</ButtonLink>
				}
			/>
			<RuntimeMetadataCallInfoTableAttribute
				label="Description"
				render={(data) => <RuntimeMetadataDescription>{data.description}</RuntimeMetadataDescription>}
			/>
			<RuntimeMetadataCallInfoTableAttribute
				label="Parameters"
				render={(data) => <RuntimeMetadataArgsViewer network={network} args={data.args} />}
			/>
		</InfoTable>
	);
};
