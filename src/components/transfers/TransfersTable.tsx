import { Extrinsic } from "../../model/extrinsic";
import { PaginatedResource } from "../../model/paginatedResource";
import { Transfer } from "../../model/transfer";
import { Chip } from "@mui/material";
import CrossIcon from "../../assets/cross-icon.png";
import CheckIcon from "../../assets/check-icon.png";
import { AccountAddress } from "../AccountAddress";
import { ButtonLink } from "../ButtonLink";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";
import { Time } from "../Time";

export type TransfersTableProps = {
	network: string;
	transfers: PaginatedResource<Transfer>,
	showTime?: boolean;
};

const TransfersTableAttribute = ItemsTableAttribute<Transfer>;

function TransfersTable(props: TransfersTableProps) {
	const {
		network,
		transfers,
		showTime,
	} = props;

	console.log(transfers);

	return (
		<ItemsTable
			data={transfers.data}
			loading={transfers.loading}
			notFound={transfers.notFound}
			notFoundMessage="No transfers found"
			error={transfers.error}
			pagination={transfers.pagination}
			data-test="transfers-table"
		>
			<TransfersTableAttribute
				label="ID"
				render={(transfer) =>
					<>
						{transfer.id}
					</>
				}
			/>
			<TransfersTableAttribute
				label="From"
				render={(transfer) =>
					<AccountAddress
						network={network}
						address={transfer.fromId}
						shorten
					/>
				}
			/>
			<TransfersTableAttribute
				label="To"
				render={(transfer) =>
					<AccountAddress
						network={network}
						address={transfer.toId}
						shorten
					/>
				}
			/>
			<TransfersTableAttribute
				label="Amount"
				render={(transfer) =>
					<>
						{transfer.amount}
					</>
				}
			/>
			<TransfersTableAttribute
				label="Success"
				render={(transfer) =>
					<Chip
						variant="outlined"
						icon={<img src={transfer.success ? CheckIcon : CrossIcon}  />}
						label={transfer.success ? "Success" : "Fail"}
					/>
				}
			/>
			{showTime &&
				<TransfersTableAttribute
					label="Time"
					render={(transfer) =>
						<Time time={transfer.timestamp} fromNow tooltip utc />
					}
				/>
			}
		</ItemsTable>
	);
}

export default TransfersTable;
