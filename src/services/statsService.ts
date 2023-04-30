import { Stats } from "../model/stats";
import { rawAmountToDecimal } from "../utils/number";
import { fetchStatsSquid} from "./fetchService";
import { getNetwork, hasSupport } from "./networksService";

export type StatsFilter = any

export type StatsOrder = string | string[];

export async function getStats(
	network: string,
	filter: StatsFilter|undefined,
	order: StatsOrder = "id_DESC",
) {
	if (hasSupport(network, "stats-squid")) {
		const response = await fetchStatsSquid<{totals: Omit<Stats, "circulatingValueTotal" & "stakedValuePercentage">[]}>(
			network,
			`query ($filter: TotalsWhereInput, $order: [TotalsOrderByInput!]!) {
                totals(limit: 1, where: $filter, orderBy: $order) {
					finalizedBlocks
					holders
					nominationPoolsCountMembers
					nominationPoolsCountPools
					nominationPoolsTotalStake
					signedExtrinsics
					stakedValueNominator
					stakedValueTotal
					stakedValueValidator
					totalIssuance
					transfersCount
					validatorsCount
					validatorsIdealCount
                }
            }`,
			{
				filter,
				order,
			}
		);

		if(response.totals[0]) {
			return unifyStats(response.totals[0], network);
		}
	}

	return undefined;
}

/*** PRIVATE ***/

function unifyStats(stats: Omit<Stats, "circulatingValueTotal" & "stakedValuePercentage">, networkName: string): Stats {
	const network = getNetwork(networkName)!;

	return {
		...stats,
		totalIssuance: rawAmountToDecimal(network, stats.totalIssuance.toString()).toNumber(),
		stakedValueTotal: rawAmountToDecimal(network, stats.stakedValueTotal.toString()).toNumber(),
		circulatingValueTotal: 0,
		stakedValuePercentage: stats.stakedValueTotal / stats.totalIssuance * 100,
	};
}