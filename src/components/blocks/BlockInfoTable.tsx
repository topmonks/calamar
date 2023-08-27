import { Block } from "../../model/block";
import { Network } from "../../model/network";
import { Resource } from "../../model/resource";
import { encodeAddress } from "../../utils/formatAddress";

import { AccountAddress } from "../AccountAddress";
import { InfoTable, InfoTableAttribute } from "../InfoTable";
import { Link } from "../Link";
import { Time } from "../Time";

export type BlockInfoTableProps = {
	network: Network;
	block: Resource<Block>;
}

const BlockInfoTableAttribute = InfoTableAttribute<Block>;

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
			<BlockInfoTableAttribute
				label="Timestamp"
				render={(data) =>
					<Time time={data.timestamp} utc />
				}
				hide={(data) => data.height === 0}
			/>
			<BlockInfoTableAttribute
				label="Block time"
				render={(data) =>
					<Time time={data.timestamp} fromNow />
				}
				hide={(data) => data.height === 0}
			/>
			<BlockInfoTableAttribute
				label="Block height"
				render={(data) => data.height}
			/>
			<BlockInfoTableAttribute
				label="Hash"
				render={(data) => data.hash}
				copyToClipboard={(data) => data.hash}
			/>
			<BlockInfoTableAttribute
				label="Parent hash"
				render={(data) =>
					<Link to={`/${network.name}/search?query=${data.parentHash}`}>
						{data.parentHash}
					</Link>
				}
				copyToClipboard={(data) => data.parentHash}
			/>
			<BlockInfoTableAttribute
				label="Validator"
				render={(data) => data.validator &&
					<AccountAddress
						network={network}
						address={data.validator}
					/>
				}
				copyToClipboard={(data) => data.validator &&
					encodeAddress(
						data.validator,
						network.prefix
					)
				}
				hide={(data) => !data.validator}
			/>
			<BlockInfoTableAttribute
				label="Spec version"
				render={(data) => data.specVersion}
			/>
		</InfoTable>

	);
};
