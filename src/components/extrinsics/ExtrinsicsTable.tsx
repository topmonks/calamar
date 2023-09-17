import { Extrinsic } from "../../model/extrinsic";
import { Network } from "../../model/network";
import { PaginatedResource } from "../../model/paginatedResource";

import { AccountAddress } from "../AccountAddress";
import { ButtonLink } from "../ButtonLink";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";
import { Time } from "../Time";

export type ExtrinsicsTableProps = {
	network: Network;
	extrinsics: PaginatedResource<Extrinsic>,
	showAccount?: boolean;
	showTime?: boolean;
};

const ExtrinsicsTableAttribute = ItemsTableAttribute<Extrinsic>;

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
			<ExtrinsicsTableAttribute
				label="ID"
				render={(extrinsic) =>
					<Link to={`/${network.name}/extrinsic/${extrinsic.id}`}>
						{extrinsic.id}
					</Link>
				}
			/>
			<ExtrinsicsTableAttribute
				label="Name"
				render={(extrinsic) =>
					<ButtonLink
						to={`/${network.name}/search?query=${extrinsic.palletName}.${extrinsic.callName}`}
						size="small"
						color="secondary"
					>
						{extrinsic.palletName}.{extrinsic.callName}
					</ButtonLink>
				}
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
