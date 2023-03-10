import { Balance } from "../../model/balance";
import { PaginatedResource } from "../../model/paginatedResource";
import { decodeAddress } from "../../utils/formatAddress";
import { AccountAddress } from "../AccountAddress";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";

export type BalancesTableProps = {
	network: string;
	balances: PaginatedResource<Balance>;
};

const BalancesItemsTableAttribute = ItemsTableAttribute<Balance>;

function BalancesTable(props: BalancesTableProps) {
	const { network, balances } = props;

	return (
		<ItemsTable
			data={balances.data}
			loading={balances.loading}
			notFound={balances.notFound}
			notFoundMessage="No balances found"
			error={balances.error}
			pagination={balances.pagination}
			data-test="balances-table"
		>
			<BalancesItemsTableAttribute
				label="Account"
				render={(balance) => 
					<AccountAddress
						network={network}
						address={decodeAddress(balance.id)}
						prefix={balance.runtimeSpec.metadata.ss58Prefix}
						shorten
					/>}
			/>
			<BalancesItemsTableAttribute
				label="Free"
				render={(balance) =>
					<>{balance.free}</>
				}
			/>

			<BalancesItemsTableAttribute
				label="Reserved"
				render={(balance) =>
					<>{balance.reserved}</>
				}
			/>
			
			<BalancesItemsTableAttribute
				label="Total"
				render={(balance) =>
					<>{balance.total}</>
				}
			/>

			<BalancesItemsTableAttribute
				label="Last update"
				render={(balance) =>
					<Link to={`/${network}/search?query=${balance.updatedAt}`}>
						{balance.updatedAt}
					</Link>
				}
			/>
		</ItemsTable>
	);
}

export default BalancesTable;
