import { Event } from "../../model/event";
import { Network } from "../../model/network";
import { Resource } from "../../model/resource";

import { ButtonLink } from "../ButtonLink";
import { DataViewer } from "../DataViewer";
import { InfoTable, InfoTableAttribute } from "../InfoTable";
import { Link } from "../Link";
import { Time } from "../Time";

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
					<Link
						to={`/${network.name}/block/${data.blockId}`}
					>
						{data.blockHeight}
					</Link>
				}
				copyToClipboard={(data) => data.blockHeight.toString()}
			/>
			<EventInfoTableAttribute
				label="Extrinsic"
				render={(data) => data.extrinsicId &&
					<Link
						to={`/${network.name}/extrinsic/${data.extrinsicId}`}
					>
						{data.extrinsicId}
					</Link>
				}
				copyToClipboard={(data) => data.extrinsicId}
			/>
			<EventInfoTableAttribute
				label="Call"
				render={(data) => data.callId &&
					<Link
						to={`/${network.name}/call/${data.callId}`}
					>
						{data.callId}
					</Link>
				}
				copyToClipboard={(data) => data.callId}
			/>
			<EventInfoTableAttribute
				label="Name"
				render={(data) =>
					<ButtonLink
						to={`/${network.name}/search?query=${data.palletName}.${data.eventName}`}
						size="small"
						color="secondary"
					>
						{data.palletName}.{data.eventName}
					</ButtonLink>
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
				render={(data) => data.specVersion}
			/>
		</InfoTable>
	);
};
