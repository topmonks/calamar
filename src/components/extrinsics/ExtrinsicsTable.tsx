import { Extrinsic } from "../../model/extrinsic";
import { Network } from "../../model/network";
import { PaginatedResource } from "../../model/paginatedResource";

import { AccountAddress } from "../account/AccountAddress";
import { ButtonLink } from "../ButtonLink";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Time } from "../Time";

import { ExtrinsicLink } from "./ExtrinsicLink";
import { ExtrinsicNameButton } from "./ExtrinsicNameButton";

export type ExtrinsicsTableProps = {
	network: Network;
	extrinsics: PaginatedResource<Extrinsic>,
	showAccount?: boolean;
	showTime?: boolean;
	onPageChange?: (page: number) => void;
};

const ExtrinsicsTableAttribute = ItemsTableAttribute<Extrinsic>;

function ExtrinsicsTable(props: ExtrinsicsTableProps) {
	const {
		network,
		extrinsics,
		showAccount,
		showTime,
		onPageChange
	} = props;

	return (
		<ItemsTable
			data={extrinsics.data}
			loading={extrinsics.loading}
			notFound={extrinsics.notFound}
			notFoundMessage="No extrinsics found"
			error={extrinsics.error}
			pageInfo={extrinsics.pageInfo}
			onPageChange={onPageChange}
			data-test="extrinsics-items"
		>
			<ExtrinsicsTableAttribute
				label="ID"
				render={(extrinsic) =>
					<ExtrinsicLink network={network} id={extrinsic.id} />
				}
			/>
			<ExtrinsicsTableAttribute
				label="Name"
				render={(extrinsic) => <ExtrinsicNameButton extrinsic={extrinsic} />}
			/>
			{showAccount &&
				<ExtrinsicsTableAttribute
					label="Account"
					render={(extrinsic) =>
						extrinsic.signer &&
							<AccountAddress
								network={network}
								address={extrinsic.signer}
								shorten
								copyToClipboard="small"
							/>
					}
				/>
			}
			{showTime &&
				<ExtrinsicsTableAttribute
					label="Time"
					render={(extrinsic) =>
						<Time time={extrinsic.timestamp} fromNow tooltip utc />
					}
				/>
			}
		</ItemsTable>
	);
}

export default ExtrinsicsTable;
