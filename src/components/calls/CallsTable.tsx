import { Call } from "../../model/call";
import { Network } from "../../model/network";
import { PaginatedResource } from "../../model/paginatedResource";

import { AccountAddress } from "../account/AccountAddress";
import { ExtrinsicLink } from "../extrinsics/ExtrinsicLink";

import { ButtonLink } from "../ButtonLink";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";

import { CallLink } from "./CallLink";
import { CallNameButton } from "./CallNameButton";

export type CallsTableProps = {
	network: Network;
	calls: PaginatedResource<Call>;
	showAccount?: boolean;
	onPageChange?: (page: number) => void;
};

const CallsTableAttribute = ItemsTableAttribute<Call>;

export const CallsTable = (props: CallsTableProps) => {
	const { network, calls, showAccount, onPageChange } = props;

	return (
		<ItemsTable
			data={calls.data}
			loading={calls.loading}
			notFound={calls.notFound}
			notFoundMessage="No calls found"
			error={calls.error}
			pageInfo={calls.pageInfo}
			onPageChange={onPageChange}
			data-test="calls-items"
		>
			<CallsTableAttribute
				label="ID"
				render={(call) =>
					<CallLink network={network} id={call.id} />
				}
			/>
			<CallsTableAttribute
				label="Name"
				render={(call) => <CallNameButton call={call} />}
			/>
			{showAccount && (
				<CallsTableAttribute
					label="Sender"
					render={(call) => call.caller &&
						<AccountAddress
							network={network}
							address={call.caller}
							shorten
							copyToClipboard="small"
						/>
					}
				/>
			)}
			<CallsTableAttribute
				label="Extrinsic"
				render={(call) =>
					<ExtrinsicLink network={network} id={call.extrinsicId} />
				}
			/>
		</ItemsTable>
	);
};
