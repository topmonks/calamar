import { encodeAddress } from "../../utils/formatAddress";

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
				label="Timestamp"
				render={(data) =>
					<Time time={data.timestamp} utc />
				}
				hide={(data) => data.height === 0}
			/>
			<InfoTableAttribute
				label="Block time"
				render={(data) =>
					<Time time={data.timestamp} fromNow />
				}
				hide={(data) => data.height === 0}
			/>
			<InfoTableAttribute
				label="Block height"
				render={(data) => data.height}
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
						{encodeAddress(network, data.validator) || data.validator}
					</Link>
				}
				copyToClipboard={(data) => data.validator}
				hide={(data) => !data.validator}
			/>
		</InfoTable>

	);
};
