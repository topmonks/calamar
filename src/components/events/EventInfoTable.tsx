import { InfoTable, InfoTableAttribute } from "../InfoTable";
import { Link } from "../Link";
import { Time } from "../Time";
import ParamsTable from "../ParamsTable";

export type EventInfoTableProps = {
	network: string;
	data: any;
	loading?: boolean;
	notFound?: boolean;
	error?: any;
}

export const EventInfoTable = (props: EventInfoTableProps) => {
	const {network, data, loading, notFound, error} = props;

	return (
		<InfoTable
			data={data}
			loading={loading}
			notFound={notFound}
			notFoundMessage="No event found"
			error={error}
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
						{data.block.id}
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
				render={(data) => data.name}
			/>
			<InfoTableAttribute
				label="Parameters"
				render={(data) =>
					<ParamsTable args={data.args} />
				}
			/>
			<InfoTableAttribute
				label="Spec version"
				render={(data) => data.block.spec.specVersion}
			/>
		</InfoTable>
	);
};
