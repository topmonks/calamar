/** @jsxImportSource @emotion/react */
import { css, Theme } from "@emotion/react";

import { ReactComponent as Logo } from "../assets/calamar-logo-export-05.svg";
import Background from "../assets/main-screen-bgr.svg";

import SearchInput from "../components/SearchInput";
import { Footer } from "../components/Footer";
import { Card } from "../components/Card";
import { ButtonLink } from "../components/ButtonLink";
import { useNetworkGroups } from "../hooks/useNetworkGroups";
import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";
import { useExtrinsicsWithoutTotalCount } from "../hooks/useExtrinsicsWithoutTotalCount";
import { TabbedContent, TabPane } from "../components/TabbedContent";
import { useTransfers } from "../hooks/useTransfers";
import TransfersTable from "../components/transfers/TransfersTable";
import { hasSupport } from "../services/networksService";
import { useBlocks } from "../hooks/useBlocks";
import BlocksTable from "../components/blocks/BlocksTable";
import { useBalances } from "../hooks/useBalances";
import BalancesTable from "../components/balances/BalancesTable";
import { useUsdRates } from "../hooks/useUsdRates";
import { useRootLoaderData } from "../hooks/useRootLoaderData";

const containerStyle = (theme: Theme) => css`
	--content-min-height: 900px;

	width: 100%;
	margin: 0;
	display: flex;
	flex-direction: column;
	align-items: stretch;

	${theme.breakpoints.up("sm")} {
		--content-min-height: 1000px;
	}

	${theme.breakpoints.up("md")} {
		--content-min-height: 1100px;
	}

	${theme.breakpoints.up("lg")} {
		--content-min-height: 1200px;
	}

	${theme.breakpoints.up("xl")} {
		--content-min-height: 1300px;
	}
`;

const contentStyle = css`
	position: relative;
	flex: 1 1 auto;
	min-height: var(--content-min-height);
`;

const backgroundStyle = css`
	position: absolute;
	top: 0;
	margin: 0;
	width: 100%;
	height: 100%;
	min-height: 100vh;
	z-index: -1;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: var(--content-min-height);
		background-color: white;
		background-position: center bottom;
		background-size: 100% auto;
		background-repeat: no-repeat;
		background-image: url(${Background});
	}

	&::after {
		content: '';
		position: absolute;
		top: var(--content-min-height);
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #9af0f7;
	}
`;

const logoStyle = css`
	width: 420px;
	margin: 40px auto;
	display: block;
	max-width: 100%;
`;

const subtitleStyle = (theme: Theme) => css`
	position: relative;
	top: -100px;
	padding: 0 16px;
	font-size: 16px;
	text-align: center;

	${theme.breakpoints.down("sm")} {
		top: -70px;
	}
`;

const searchBoxStyle = css`
	display: flex;
	margin: auto;
	max-width: 1000px;
	padding-left: 16px;
	padding-right: 16px;
	text-align: center;
	justify-content: center;
`;

const searchInputStyle = (theme: Theme) => css`
	flex: 1 1 auto;

	.MuiInputBase-root {
		.MuiInputBase-input,
		.MuiSelect-select {
			padding: 16px 24px;
		}
	}

	${theme.breakpoints.up("md")} {
		.MuiButton-root {
			padding-left: 52px;
			padding-right: 52px;
		}
	}
`;

const networksStyle = css`
	box-sizing: border-box;
	max-width: 1032px;
	margin: 0 auto;
	margin-top: 64px;
	margin-bottom: 48px;
	padding: 0 16px;
`;

const networksGroupStyle = (theme: Theme) => css`
	margin: 24px 0;
	padding: 16px;
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(180px, auto));
	gap: 16px;

	${theme.breakpoints.up("md")} {
		padding: 16px;
	}
`;

const newtorkGroupTitleStyle = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	font-size: 18px;
	font-weight: 700;
	opacity: .75;

	div {
		font-size: 16px;
		font-weight: 400;
	}
`;

const networkButtonStyle = css`
	display: flex;
	align-items: center;
	justify-content: flex-start;
	padding: 16px;
	line-height: normal;

	font-size: 16px;
	font-weight: 400;
	text-decoration: none;

	color: inherit;
	background-color: #f5f5f5;
	border-radius: 8px;

	img {
		width: 32px;
		height: 32px;
		object-fit: contain;
		margin-right: 12px;
		margin-left: 4px;
	}

	&[data-network=polkadot],
	&[data-network=kusama] {
		grid-row-start: 2;
		grid-row-end: 4;
	}
`;

const footerStyle = css`
	flex: 0 0 auto;

	> div {
		max-width: 1000px;
	}
`;

export const HomePage = () => {
	const networkGroups = useNetworkGroups();

	const { network } = useRootLoaderData();

	const extrinsics = useExtrinsicsWithoutTotalCount(network.name, undefined, "id_DESC");
	const blocks = useBlocks(network.name, undefined, "id_DESC");
	const transfers = useTransfers(network.name, undefined, "id_DESC");
	const topHolders = useBalances(network.name, undefined, "total_DESC");

	const usdRates = useUsdRates();

	return (
		<div css={containerStyle}>
			<div css={backgroundStyle} data-test="background" />
			<div css={contentStyle}>
				<Logo css={logoStyle} />
				<div css={subtitleStyle}>Block explorer for BitTensor ecosystem</div>
				<div css={searchBoxStyle}>
					<SearchInput
						css={searchInputStyle}
						defaultNetwork={"polkadot"}
						persistNetwork
					/>
				</div>
				{/* <div css={networksStyle}>
					{networkGroups.map((group) =>
						<Card css={networksGroupStyle} key={group.relayChainNetwork?.name || "other"}>
							<div css={newtorkGroupTitleStyle}>
								{group.relayChainNetwork?.displayName || "Other"}
								{group.relayChainNetwork && <div>and parachains</div>}
							</div>
							{group.networks.map(network =>
								network && (
									<ButtonLink to={`/${network.name}`} key={network.name} css={networkButtonStyle} data-network={network.name}>
										<img src={network.icon} />
										{network.displayName}
									</ButtonLink>
								)
							)}
						</Card>
					)}
				</div> */}
				<div css={networksStyle}>
					<Card>
						<TabbedContent>
							<TabPane
								label="Extrinsics"
								count={extrinsics.pagination.totalCount}
								loading={extrinsics.loading}
								error={extrinsics.error}
								value="extrinsics"
							>
								<ExtrinsicsTable network={network.name} extrinsics={extrinsics} showAccount showTime />
							</TabPane>
							<TabPane
								label="Blocks"
								count={blocks.pagination.totalCount}
								loading={blocks.loading}
								error={blocks.error}
								value="blocks"
							>
								<BlocksTable network={network.name} blocks={blocks} showValidator showTime />
							</TabPane>


							{hasSupport(network.name, "main-squid") &&
									<TabPane
										label="Transfers"
										count={transfers.pagination.totalCount}
										loading={transfers.loading}
										error={transfers.error}
										value="transfers"
									>
										<TransfersTable network={network.name} transfers={transfers} showTime />
									</TabPane>
							}
							{hasSupport(network.name, "balances-squid") &&
									<TabPane
										label="Top holders"
										count={topHolders.pagination.totalCount}
										loading={topHolders.loading}
										error={topHolders.error}
										value="top-holders"
									>
										<BalancesTable network={network.name} balances={topHolders} usdRates={usdRates} />
									</TabPane>
							}
						</TabbedContent>
					</Card>
				</div>
			</div>
			<Footer css={footerStyle} />
		</div>
	);
};
