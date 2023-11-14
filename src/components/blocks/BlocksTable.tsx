import { Block } from "../../model/block";
import { Network } from "../../model/network";
import { PaginatedResource } from "../../model/paginatedResource";

import { AccountAddress } from "../account/AccountAddress";

import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Time } from "../Time";

import { BlockLink } from "./BlockLink";

export type BlocksTableProps = {
	network: Network;
	blocks: PaginatedResource<Block>,
	showValidator: boolean,
	showTime?: boolean;
	onPageChange?: (page: number) => void;
};

const BlocksTableAttribute = ItemsTableAttribute<Block>;

function ExtrinsicsTable(props: BlocksTableProps) {
	const {
		network,
		blocks,
		showValidator,
		showTime,
		onPageChange
	} = props;

	return (
		<ItemsTable
			data={blocks.data}
			loading={blocks.loading}
			notFound={blocks.notFound}
			notFoundMessage="No blocks found"
			error={blocks.error}
			pageInfo={blocks.pageInfo}
			onPageChange={onPageChange}
			data-test="blocks-table"
		>
			<BlocksTableAttribute
				label="Height"
				render={(block) =>
					<BlockLink network={network} id={block.id} />
				}
			/>
			<BlocksTableAttribute
				label="Spec version"
				render={(block) => block.specVersion}
			/>
			{showValidator &&
				<BlocksTableAttribute
					label="Validator"
					render={(block) =>
						block.validator &&
						<AccountAddress
							network={network}
							address={block.validator}
							shorten
							copyToClipboard="small"
						/>
					}
				/>
			}
			{showTime &&
				<BlocksTableAttribute
					label="Time"
					render={(block) =>
						<Time time={block.timestamp} fromNow tooltip utc />
					}
				/>
			}
		</ItemsTable>
	);
}

export default ExtrinsicsTable;
