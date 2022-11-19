import { InfoTable, InfoTableAttribute } from "../InfoTable";
import { Link } from "../Link";
import { Time } from "../Time";

export type BlockInfoTableProps = {
	network: string;
	data: any;
	loading?: boolean;
	notFound?: boolean;
	error?: any;
}

export const BlockInfoTable = (props: BlockInfoTableProps) => {
	const {network, data, loading, notFound, error} = props;

	return (
		<InfoTable
			data={data}
			loading={loading}
			notFound={notFound}
			notFoundMessage="No block found"
			error={error}
		>
			<InfoTableAttribute
				label="ID"
				render={(data) => data.id}
			/>
			<InfoTableAttribute
				label="Hash"
				render={(data) => data.hash}
				copyToClipboard={(data) => data.hash}
			/>
			<InfoTableAttribute
				label="Parent hash"
				render={(data) =>
					<Link to={`/${network}/search?query=${data.parentHash}`}>
						{data.parentHash}
					</Link>
				}
				copyToClipboard={(data) => data.parentHash}
			/>
			<InfoTableAttribute
				label="Validator"
				render={(data) => data.validator &&
					<Link to={`/${network}/account/${data.validator}`}>
						{data.validator}
					</Link>
				}
				copyToClipboard={(data) => data.validator}
			/>
			<InfoTableAttribute
				label="Height"
				render={(data) => data.height}
			/>
			<InfoTableAttribute
				label="Date"
				render={(data) => data.height !== 0 &&
					<Time time={data.timestamp} fromNow />
				}
			/>
		</InfoTable>

	);
};
