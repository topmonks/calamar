import { Balance } from "../../model/balance";
import { PaginatedResource } from "../../model/paginatedResource";
import { Resource } from "../../model/resource";
import { USDRates } from "../../model/usdRates";
import { getNetwork } from "../../services/networksService";
import { decodeAddress } from "../../utils/formatAddress";
import { AccountAddress } from "../AccountAddress";
import { Currency } from "../Currency";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";

export type BalancesTableProps = {
	network: string;
	balances: PaginatedResource<Balance>;
	usdRates: Resource<USDRates>;
};

const BalancesItemsTableAttribute = ItemsTableAttribute<Balance, never, [USDRates]>;

function BalancesTable(props: BalancesTableProps) {
	const { network, balances, usdRates } = props;

	return (
		<ItemsTable
			data={balances.data}
			additionalData={[usdRates.data]}
			loading={balances.loading || usdRates.loading}
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
				label="Total"
				render={(balance, usdRates) =>
					<Currency
						amount={balance.total}
						symbol={getNetwork(network)?.symbol}
						autoDecimalPlaces
						usdRate={usdRates[network]}
						showUSDValue
						showFullInTooltip
					/>
				}
			/>

			<BalancesItemsTableAttribute
				label="Free"
				render={(balance, usdRates) =>
					<Currency
						amount={balance.free}
						symbol={getNetwork(network)?.symbol}
						autoDecimalPlaces
						usdRate={usdRates[network]}
						showUSDValue
						showFullInTooltip
					/>
				}
			/>

			<BalancesItemsTableAttribute
				label="Reserved"
				render={(balance, usdRates) =>
					<Currency
						amount={balance.reserved}
						symbol={getNetwork(network)?.symbol}
						autoDecimalPlaces
						usdRate={usdRates[network]}
						showUSDValue
						showFullInTooltip
					/>
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
