import { Call } from "../../model/call";
import { PaginatedResource } from "../../model/paginatedResource";
import { AccountAddress } from "../AccountAddress";
import { ButtonLink } from "../ButtonLink";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";

export type CallsTableProps = {
	network: string;
	calls: PaginatedResource<Call>;
	showAccount?: boolean;
};

const CallsTableAttribute = ItemsTableAttribute<Call>;

export const CallsTable = (props: CallsTableProps) => {
	const { network, calls, showAccount } = props;

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
			<CallsTableAttribute
				label="ID"
				render={(call) =>
					<Link to={`/${network}/call/${call.id}`}>
						{call.id}
					</Link>
				}
			/>
			<CallsTableAttribute
				label="Name"
				render={(call) =>
					<ButtonLink
						to={`/${network}/search?query=${call.palletName}.${call.callName}`}
						size="small"
						color="secondary"
					>
						{call.palletName}.{call.callName}
					</ButtonLink>
				}
			/>
			{showAccount && (
				<CallsTableAttribute
					label="Sender"
					render={(call) => call.caller &&
						<AccountAddress
							network={network}
							address={call.caller}
							prefix={call.runtimeSpec.metadata.ss58Prefix}
							shorten
						/>
					}
				/>
			)}
			<CallsTableAttribute
				label="Extrinsic"
				render={(call) =>
					<Link to={`/${network}/extrinsic/${call.extrinsicId}`}>
						{call.extrinsicId}
					</Link>
				}
			/>
		</ItemsTable>
	);
};
