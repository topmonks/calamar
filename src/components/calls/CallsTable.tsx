import { Pagination } from "../../hooks/usePagination";
import { encodeAddress } from "../../utils/formatAddress";
import { shortenHash } from "../../utils/shortenHash";
import { shortenId } from "../../utils/shortenId";

import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";

export type CallsTableProps = {
	network: string;
	items: any[];
	pagination: Pagination;
	loading?: boolean;
	notFound?: boolean;
	error?: any;
};

export const CallsTable = (props: CallsTableProps) => {
	const { network, items, pagination, loading, notFound, error } = props;

	return (
		<ItemsTable
			items={items}
			loading={loading}
			notFound={notFound}
			notFoundMessage="No calls found"
			error={error}
			pagination={pagination}
			data-test="calls-table"
		>
			<ItemsTableAttribute
				label="ID"
				render={(call) =>
					<Link to={`/${network}/call/${call.id}`}>
						{shortenId(call.id)}
					</Link>
				}
			/>
			<ItemsTableAttribute
				label="Name"
				render={(call) => call.name}
			/>
			<ItemsTableAttribute
				label="Sender"
				render={(call) =>
					call.origin && call.origin.value.__kind !== "None" && (
						<Link
							to={`/${network}/account/${call.origin.value.value}`}
						>
							{shortenHash(
								(network &&
									encodeAddress(network, call.origin.value.value)) ||
								call.origin.value.value
							)}
						</Link>
					)
				}
			/>
			<ItemsTableAttribute
				label="Extrinsic"
				render={(call) =>
					<Link to={`/${network}/extrinsic/${call.extrinsic.id}`}>
						{shortenId(call.extrinsic.id)}
					</Link>
				}
			/>
		</ItemsTable>
	);
};
