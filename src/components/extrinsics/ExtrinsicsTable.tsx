import { ReactNode } from "react";

import { Pagination } from "../../hooks/usePagination";
import { encodeAddress } from "../../utils/formatAddress";
import { shortenHash } from "../../utils/shortenHash";

import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";
import { Time } from "../Time";

export type ExtrinsicsTableProps = {
	network: string;
	items: any[];
	pagination: Pagination;
	showTime?: boolean;
	loading?: boolean;
	notFound?: boolean;
	error?: any;
};

function ExtrinsicsTable(props: ExtrinsicsTableProps) {
	const {
		network,
		items,
		pagination,
		showTime,
		loading,
		notFound,
		error
	} = props;

	return (
		<ItemsTable
			items={items}
			loading={loading}
			notFound={notFound}
			notFoundMessage="No extrinsics found"
			error={error}
			pagination={pagination}
			data-test="extrinsics-table"
		>
			<ItemsTableAttribute
				label="ID"
				render={(extrinsic) =>
					<Link to={`/${network}/extrinsic/${extrinsic.id}`}>
						{extrinsic.id}
					</Link>
				}
			/>
			<ItemsTableAttribute
				label="Name"
				render={(extrinsic) => extrinsic.call.name}
			/>
			<ItemsTableAttribute
				label="Account"
				render={(extrinsic) =>
					<Link
						to={`/${network}/account/${extrinsic.signature?.address}`}
					>
						{shortenHash(
							(network &&
								encodeAddress(network, extrinsic.signature?.address)) ||
							extrinsic.signature?.address
						)}
					</Link>
				}
			/>
			{showTime &&
				<ItemsTableAttribute
					label="Time"
					render={(extrinsic) =>
						<Time time={extrinsic.block.timestamp} fromNow tooltip utc />
					}
				/>
			}
		</ItemsTable>
	);
}

export default ExtrinsicsTable;
