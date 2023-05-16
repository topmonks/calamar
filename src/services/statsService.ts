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
		const response = await fetchStatsSquid<{currents: Omit<Stats, "circulatingValueTotal" & "stakedValuePercentage">[]}>(
			network,
			`query ($filter: CurrentWhereInput, $order: [CurrentOrderByInput!]!) {
                currents(limit: 1, where: $filter, orderBy: $order) {
					chainFinalizedBlocks
					nominationPoolsMembersAmount
					nominationPoolsPoolsActiveTotalStake
					chainSignedExtrinsics
					stakingTotalStake
					balancesTotalIssuance
					balancesTransfersAmount
					stakingActiveValidatorsAmount
    				stakingValidatorsIdealAmount
					stakingInflationRatio
    				stakingRewardsRatio
					nominationPoolsPoolsActiveAmount
                }
            }`,
			{
				filter,
				order,
			}
		);

		if(response.currents[0]) {
			return unifyStats(response.currents[0], network);
		}
	}

	return undefined;
}

/*** PRIVATE ***/

function unifyStats(stats: Omit<Stats, "circulatingValueTotal" & "stakedValuePercentage">, networkName: string): Stats {
	const network = getNetwork(networkName)!;

	return {
		...stats,
		balancesTotalIssuance: rawAmountToDecimal(network, stats.balancesTotalIssuance.toString()).toNumber(),
		stakingTotalStake: rawAmountToDecimal(network, stats.stakingTotalStake.toString()).toNumber(),
		circulatingValueTotal: 0,
		stakedValuePercentage: stats.stakingTotalStake / stats.balancesTotalIssuance * 100,
	};
}