import { Pagination } from "../../hooks/usePagination";
import { getSignatureAddress } from "../../utils/signature";

import { AccountAddress } from "../AccountAddress";
import { ButtonLink } from "../ButtonLink";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";
import { Time } from "../Time";

export type ExtrinsicsTableProps = {
	network: string;
	items: any[];
	pagination: Pagination;
	showAccount?: boolean;
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
		showAccount,
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
