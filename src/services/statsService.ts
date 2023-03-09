import { Stats } from "../model/stats";
import { fetchStatsSquid} from "./fetchService";
import { hasSupport } from "./networksService";

export type StatsFilter = any

export type StatsOrder = string | string[];

export async function getStats(
	network: string,
	filter: StatsFilter|undefined,
	order: StatsOrder = "id_DESC",
) {
	if (hasSupport(network, "stats-squid")) {
		const response = await fetchStatsSquid<{totals: Stats[]}>(
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
		
		return response.totals[0];
	}

	return undefined;
}
