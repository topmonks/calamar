import { Resource } from "../../model/resource";
import { RuntimeSpec } from "../../model/runtimeSpec";
import { getEventMetadataByName } from "../../utils/queryMetadata";

import { ButtonLink } from "../ButtonLink";
import DataViewer from "../DataViewer";
import { InfoTable, InfoTableAttribute } from "../InfoTable";
import { Link } from "../Link";
import { Time } from "../Time";

export type EventInfoTableProps = {
	network: string;
	event: Resource<any>;
	runtimeSpecs: Resource<RuntimeSpec[]>;
}

export const EventInfoTable = (props: EventInfoTableProps) => {
	const {network, event, runtimeSpecs} = props;

	return (
		<InfoTable
			data={event.data}
			additionalData={[runtimeSpecs.data?.[0]?.metadata]}
			loading={event.loading || runtimeSpecs.loading}
			notFound={event.notFound}
			notFoundMessage="No event found"
			error={event.error}
		>
			<InfoTableAttribute
				label="Timestamp"
				render={(data) =>
					<Time time={data.block.timestamp} utc />
				}
			/>
			<InfoTableAttribute
				label="Block time"
				render={(data) =>
					<Time time={data.block.timestamp} fromNow />
				}
			/>
			<InfoTableAttribute
				label="Block"
				render={(data) =>
					<Link
						to={`/${network}/block/${data.block.id}`}
					>
						{data.block.height}
					</Link>
				}
				copyToClipboard={(data) => data.block.height}
			/>
			<InfoTableAttribute
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
			<InfoTableAttribute
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
			<InfoTableAttribute
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
			<InfoTableAttribute
				label="Parameters"
				render={(data, metadata) =>
					<DataViewer
						network={network}
						data={data.args}
						metadata={metadata && getEventMetadataByName(metadata, data.name)?.args}
						copyToClipboard
					/>
				}
				hide={(data) => !data.args}
			/>
			<InfoTableAttribute
				label="Spec version"
				render={(data) => data.block.spec.specVersion}
			/>
		</InfoTable>
	);
};
