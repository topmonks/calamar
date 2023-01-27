import { Event } from "../../model/event";
import { Resource } from "../../model/resource";
import { getEventMetadataByName } from "../../utils/queryMetadata";

import { ButtonLink } from "../ButtonLink";
import DataViewer from "../DataViewer";
import { InfoTable, InfoTableAttribute } from "../InfoTable";
import { Link } from "../Link";
import { Time } from "../Time";

export type EventInfoTableProps = {
	network: string;
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
					<Time time={data.block.timestamp} utc />
				}
			/>
			<EventInfoTableAttribute
				label="Block time"
				render={(data) =>
					<Time time={data.block.timestamp} fromNow />
				}
			/>
			<EventInfoTableAttribute
				label="Block"
				render={(data) =>
					<Link
						to={`/${network}/block/${data.block.id}`}
					>
						{data.block.height}
					</Link>
				}
				copyToClipboard={(data) => data.block.height.toString()}
			/>
			<EventInfoTableAttribute
				label="Extrinsic"
				render={(data) => data.extrinsic &&
					<Link
						to={`/${network}/extrinsic/${data.extrinsic.id}`}
					>
						{data.extrinsic.id}
					</Link>
				}
				copyToClipboard={(data) => data.extrinsic?.id}
			/>
			<EventInfoTableAttribute
				label="Call"
				render={(data) => data.call &&
					<Link
						to={`/${network}/call/${data.call.id}`}
					>
						{data.call.id}
					</Link>
				}
				copyToClipboard={(data) => data.call?.id}
			/>
			<EventInfoTableAttribute
				label="Name"
				render={(data) =>
					<ButtonLink
						to={`/${network}/search?query=${data.name}`}
						size="small"
						color="secondary"
					>
						{data.name}
					</ButtonLink>
				}
			/>
			<EventInfoTableAttribute
				label="Parameters"
				render={(data) =>
					<DataViewer
						network={network}
						data={data.args}
						metadata={getEventMetadataByName(data.runtimeSpec.metadata, data.name)?.args}
						runtimeSpec={data.runtimeSpec}
						copyToClipboard
					/>
				}
				hide={(data) => !data.args}
			/>
			<EventInfoTableAttribute
				label="Spec version"
				render={(data) => data.block.spec.specVersion}
			/>
		</InfoTable>
	);
};
