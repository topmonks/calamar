import { Balance } from "../../model/balance";
import { Network } from "../../model/network";
import { PaginatedResource } from "../../model/paginatedResource";
import { Resource } from "../../model/resource";
import { UsdRates } from "../../model/usdRates";
import { decodeAddress } from "../../utils/address";

import { AccountAddress } from "./AccountAddress";

import { Currency } from "../Currency";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";

export type HoldersTableProps = {
	network: Network;
	balances: PaginatedResource<Balance>;
	usdRates: Resource<UsdRates>;
	onPageChange?: (page: number) => void;
};

const HoldersTableAttribute = ItemsTableAttribute<Balance, never, [UsdRates|undefined]>;

function HoldersTable(props: HoldersTableProps) {
	const { network, balances, usdRates, onPageChange } = props;

	return (
		<ItemsTable
			data={balances.data}
			additionalData={[usdRates.data]}
			loading={balances.loading || usdRates.loading}
			notFound={balances.notFound}
			notFoundMessage="No balances found"
			error={balances.error}
			pageInfo={balances.pageInfo}
			onPageChange={onPageChange}
			data-test="holders-items"
		>
			<HoldersTableAttribute
				label="Account"
				render={(balance) =>
					<AccountAddress
						network={network}
						address={decodeAddress(balance.id)}
						shorten
						copyToClipboard="small"
					/>}
			/>

			<HoldersTableAttribute
				label="Total"
				render={(balance, usdRates) =>
					<Currency
						amount={balance.total}
						currency={network.symbol}
						decimalPlaces="optimal"
						usdRate={usdRates?.[network.name]}
						showFullInTooltip
						showUsdValue
					/>
				}
			/>

			<HoldersTableAttribute
				label="Free"
				render={(balance, usdRates) =>
					<Currency
						amount={balance.free}
						currency={network.symbol}
						decimalPlaces="optimal"
						usdRate={usdRates?.[network.name]}
						showFullInTooltip
						showUsdValue
					/>
				}
			/>

			<HoldersTableAttribute
				label="Reserved"
				render={(balance, usdRates) =>
					<Currency
						amount={balance.reserved}
						currency={network.symbol}
						decimalPlaces="optimal"
						usdRate={usdRates?.[network.name]}
						showFullInTooltip
						showUsdValue
					/>
				}
			/>

			<HoldersTableAttribute
				label="Last update"
				render={(balance) =>
					<Link to={`/${network.name}/search?query=${balance.updatedAtBlock}`}>
						{balance.updatedAtBlock}
					</Link>
				}
			/>
		</ItemsTable>
	);
}

export default HoldersTable;
