import { shortenId } from "../../utils/shortenId";

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
				label="Id"
				render={(data) => data.id}
			/>
			<InfoTableAttribute
				label="Name"
				render={(data) => data.name}
			/>
			<InfoTableAttribute
				label="Block time"
				render={(data) =>
					<Time time={data.block.timestamp} fromNow />
				}
			/>
			<InfoTableAttribute
				label="Spec version"
				render={(data) => data.block.spec.specVersion}
			/>
			<InfoTableAttribute
				label="Call"
				render={(data) => data.call &&
					<Link
						to={`/${network}/call/${data.call.id}`}
					>
						{shortenId(data.call.id)}
					</Link>
				}
				copyToClipboard={(data) => data.call?.id}
			/>
			<InfoTableAttribute
				label="Extrinsic"
				render={(data) =>
					<Link
						to={`/${network}/extrinsic/${data.extrinsic.id}`}
					>
						{shortenId(data.extrinsic.id)}
					</Link>
				}
				copyToClipboard={(data) => data.extrinsic.id}
			/>
			<InfoTableAttribute
				label="Block"
				render={(data) =>
					<Link
						to={`/${network}/block/${data.block.id}`}
					>
						{shortenId(data.block.id)}
					</Link>
				}
				copyToClipboard={(data) => data.block.height}
			/>
			<InfoTableAttribute
				label="Parameters"
				render={(data) =>
					<ParamsTable args={data.args} />
				}
			/>
		</InfoTable>
	);
};
