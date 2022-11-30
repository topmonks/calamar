import { PaginatedResource } from "../../model/paginatedResource";

import { AccountAddress } from "../AccountAddress";
import { ButtonLink } from "../ButtonLink";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";

export type CallsTableProps = {
	network: string;
	calls: PaginatedResource<any>;
};

export const CallsTable = (props: CallsTableProps) => {
	const { network, calls } = props;

	return (
		<ItemsTable
			data={calls.data}
			loading={calls.loading}
			notFound={calls.notFound}
			notFoundMessage="No calls found"
			error={calls.error}
			pagination={calls.pagination}
			data-test="calls-table"
		>
			<ItemsTableAttribute
				label="ID"
				render={(call) =>
					<Link to={`/${network}/call/${call.id}`}>
						{call.id}
					</Link>
				}
			/>
			<ItemsTableAttribute
				label="Name"
				render={(call) =>
					<ButtonLink
						to={`/${network}/search?query=${call.name}`}
						size="small"
						color="secondary"
					>
						{call.name}
					</ButtonLink>
				}
			/>
			<ItemsTableAttribute
				label="Sender"
				render={(call) =>
					call.origin && call.origin.value.__kind !== "None" && (
						<AccountAddress
							network={network}
							address={call.origin.value.value}
							shorten
						/>
					)
				}
			/>
			<ItemsTableAttribute
				label="Extrinsic"
				render={(call) =>
					<Link to={`/${network}/extrinsic/${call.extrinsic.id}`}>
						{call.extrinsic.id}
					</Link>
				}
			/>
		</ItemsTable>
	);
};
