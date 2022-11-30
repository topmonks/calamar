import { PaginatedResource } from "../../model/paginatedResource";
import { getSignatureAddress } from "../../utils/signature";

import { AccountAddress } from "../AccountAddress";
import { ButtonLink } from "../ButtonLink";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";
import { Time } from "../Time";

export type ExtrinsicsTableProps = {
	network: string;
	extrinsics: PaginatedResource<any>,
	showAccount?: boolean;
	showTime?: boolean;
};

function ExtrinsicsTable(props: ExtrinsicsTableProps) {
	const {
		network,
		extrinsics,
		showAccount,
		showTime,
	} = props;

	return (
		<ItemsTable
			data={extrinsics.data}
			loading={extrinsics.loading}
			notFound={extrinsics.notFound}
			notFoundMessage="No extrinsics found"
			error={extrinsics.error}
			pagination={extrinsics.pagination}
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
				render={(extrinsic) =>
					<ButtonLink
						to={`/${network}/search?query=${extrinsic.call.name}`}
						size="small"
						color="secondary"
					>
						{extrinsic.call.name}
					</ButtonLink>
				}
			/>
			{showAccount &&
				<ItemsTableAttribute
					label="Account"
					render={(extrinsic) =>
						extrinsic.signature &&
							<AccountAddress
								network={network}
								address={getSignatureAddress(extrinsic.signature)}
								shorten
							/>
					}
				/>
			}
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
