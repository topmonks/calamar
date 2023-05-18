import { Balance } from "../../model/balance";
import { PaginatedResource } from "../../model/paginatedResource";
import { Resource } from "../../model/resource";
import { UsdRates } from "../../model/usdRates";
import { getNetwork } from "../../services/networksService";
import { decodeAddress } from "../../utils/formatAddress";
import { AccountAddress } from "../AccountAddress";
import { Currency } from "../Currency";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";

export type BalancesTableProps = {
	network: string;
	balances: PaginatedResource<Balance>;
	usdRates: Resource<UsdRates>;
};

const BalancesItemsTableAttribute = ItemsTableAttribute<Balance, never, [UsdRates]>;

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
						copyToClipboard="small"
					/>}
			/>

			<BalancesItemsTableAttribute
				label="Total"
				render={(balance, usdRates) =>
					<Currency
						amount={balance.total}
						currency={getNetwork(network).symbol}
						decimalPlaces="optimal"
						usdRate={usdRates[network]}
						showFullInTooltip
						showUsdValue
					/>
				}
			/>

			<BalancesItemsTableAttribute
				label="Free"
				render={(balance, usdRates) =>
					<Currency
						amount={balance.free}
						currency={getNetwork(network).symbol}
						decimalPlaces="optimal"
						usdRate={usdRates[network]}
						showFullInTooltip
						showUsdValue
					/>
				}
			/>

			<BalancesItemsTableAttribute
				label="Reserved"
				render={(balance, usdRates) =>
					<Currency
						amount={balance.reserved}
						currency={getNetwork(network).symbol}
						decimalPlaces="optimal"
						usdRate={usdRates[network]}
						showFullInTooltip
						showUsdValue
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
