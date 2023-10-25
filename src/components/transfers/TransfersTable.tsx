import { Chip } from "@mui/material";

import CrossIcon from "../../assets/cross-icon.png";
import CheckIcon from "../../assets/check-icon.png";

import { PaginatedResource } from "../../model/paginatedResource";
import { Transfer } from "../../model/transfer";
import { Network } from "../../model/network";

import { AccountAddress } from "../AccountAddress";
import { Currency } from "../Currency";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";
import { Time } from "../Time";

export type TransfersTableProps = {
	network: Network;
	transfers: PaginatedResource<Transfer>,
	showTime?: boolean;
	onPageChange?: (page: number) => void;
};

const TransfersTableAttribute = ItemsTableAttribute<Transfer>;

function TransfersTable(props: TransfersTableProps) {
	const {
		network,
		transfers,
		showTime,
		onPageChange
	} = props;

	console.log(transfers);

	return (
		<ItemsTable
			data={transfers.data}
			loading={transfers.loading}
			notFound={transfers.notFound}
			notFoundMessage="No transfers found"
			error={transfers.error}
			pageInfo={transfers.pageInfo}
			onPageChange={onPageChange}
			data-test="transfers-table"
		>
			<TransfersTableAttribute
				label="Extrinsic"
				render={(transfer) => transfer.extrinsic &&
					<Link to={`/${network.name}/extrinsic/${transfer.extrinsic.id}`}>
						{transfer.extrinsic.id}
					</Link>
				}
			/>
			<TransfersTableAttribute
				label="From"
				render={(transfer) =>
					<AccountAddress
						network={network}
						address={transfer.fromPublicKey}
						shorten
						copyToClipboard="small"
					/>
				}
			/>
			<TransfersTableAttribute
				label="To"
				render={(transfer) =>
					<AccountAddress
						network={network}
						address={transfer.toPublicKey}
						shorten
						copyToClipboard="small"
					/>
				}
			/>
			<TransfersTableAttribute
				label="Amount"
				render={(transfer) =>
					<Currency
						amount={transfer.amount}
						currency={network.symbol}
						decimalPlaces="optimal"
						showFullInTooltip
					/>
				}
			/>
			<TransfersTableAttribute
				label="Success"
				colCss={{width: 180}}
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
					colCss={{width: 200}}
					render={(transfer) =>
						<Time time={transfer.timestamp} fromNow tooltip utc />
					}
				/>
			}
		</ItemsTable>
	);
}

export default TransfersTable;
