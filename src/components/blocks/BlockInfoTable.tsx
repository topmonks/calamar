import { Resource } from "../../model/resource";
import { encodeAddress } from "../../utils/formatAddress";

import { AccountAddress } from "../AccountAddress";
import { InfoTable, InfoTableAttribute } from "../InfoTable";
import { Link } from "../Link";
import { Time } from "../Time";

export type BlockInfoTableProps = {
	network: string;
	block: Resource<any>;
}

export const BlockInfoTable = (props: BlockInfoTableProps) => {
	const {network, block} = props;

	return (
		<InfoTable
			data={block.data}
			loading={block.loading}
			notFound={block.notFound}
			notFoundMessage="No block found"
			error={block.error}
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
					<AccountAddress network={network} address={data.validator} />
				}
				copyToClipboard={(data) => encodeAddress(network, data.validator)}
				hide={(data) => !data.validator}
			/>
			<InfoTableAttribute
				label="Spec version"
				render={(data) => data.spec.specVersion}
			/>
		</InfoTable>

	);
};
