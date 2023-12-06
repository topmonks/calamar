import { Event } from "../../model/event";
import { Network } from "../../model/network";
import { Resource } from "../../model/resource";

import { BlockLink } from "../blocks/BlockLink";
import { CallLink } from "../calls/CallLink";
import { ExtrinsicLink } from "../extrinsics/ExtrinsicLink";

import { DataViewer } from "../DataViewer";
import { InfoTable, InfoTableAttribute } from "../InfoTable";
import { Link } from "../Link";
import { NetworkBadge } from "../NetworkBadge";
import { Time } from "../Time";

import { EventNameButton } from "./EventNameButton";
import { EventRuntimeMetadataButton } from "./EventRuntimeMetadataButton";

export type EventInfoTableProps = {
	network: Network;
	event: Resource<Event>;
}

const EventInfoTableAttribute = InfoTableAttribute<Event>;

export const EventInfoTable = (props: EventInfoTableProps) => {
	const {network, event} = props;

	return (
		<InfoTable
			data={event.data}
			loading={event.loading}
			notFound={event.notFound}
			notFoundMessage="No event found"
			error={event.error}
		>
			<EventInfoTableAttribute
				label="Network"
				render={(data) =>
					<NetworkBadge network={data.network} />
				}
			/>
			<EventInfoTableAttribute
				label="Timestamp"
				render={(data) =>
					<Time time={data.timestamp} utc />
				}
			/>
			<EventInfoTableAttribute
				label="Block time"
				render={(data) =>
					<Time time={data.timestamp} fromNow />
				}
			/>
			<EventInfoTableAttribute
				label="Block"
				render={(data) =>
					<BlockLink network={network} id={data.blockId} />
				}
				copyToClipboard={(data) => data.blockHeight.toString()}
			/>
			<EventInfoTableAttribute
				label="Extrinsic"
				render={(data) => data.extrinsicId &&
					<ExtrinsicLink network={network} id={data.extrinsicId} />
				}
				copyToClipboard={(data) => data.extrinsicId}
			/>
			<EventInfoTableAttribute
				label="Call"
				render={(data) => data.callId &&
					<CallLink network={network} id={data.callId} />
				}
				copyToClipboard={(data) => data.callId}
			/>
			<EventInfoTableAttribute
				label="Name"
				render={(data) =>
					<>
						<EventNameButton event={data} />
						{data.metadata.event && <EventRuntimeMetadataButton event={data} />}
					</>
				}
			/>
			<EventInfoTableAttribute
				label="Parameters"
				render={(data) =>
					<DataViewer
						network={network}
						data={data.args}
						metadata={data.metadata.event?.args}
						copyToClipboard
					/>
				}
				hide={(data) => !data.args}
			/>
			<EventInfoTableAttribute
				label="Spec version"
				render={(data) =>
					<Link to={`/${data.network.name}/runtime/${data.specVersion}`}>
						{data.specVersion}
					</Link>
				}
			/>
		</InfoTable>
	);
};
