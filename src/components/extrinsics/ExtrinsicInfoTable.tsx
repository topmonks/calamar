/** @jsxImportSource @emotion/react */
import { Chip } from "@mui/material";

import CrossIcon from "../../assets/cross-icon.png";
import CheckIcon from "../../assets/check-icon.png";

import { Extrinsic } from "../../model/extrinsic";
import { Network } from "../../model/network";
import { Resource } from "../../model/resource";

import { encodeAddress } from "../../utils/address";

import { AccountAddress } from "../account/AccountAddress";
import { BlockLink } from "../blocks/BlockLink";

import { ButtonLink } from "../ButtonLink";
import { DataViewer } from "../DataViewer";
import { InfoTable, InfoTableAttribute } from "../InfoTable";
import { NetworkBadge } from "../NetworkBadge";
import { Time } from "../Time";

export type ExtrinsicInfoTableProps = {
	network: Network;
	extrinsic: Resource<Extrinsic>;
}

const ExtrinsicInfoTableAttribute = InfoTableAttribute<Extrinsic>;

export const ExtrinsicInfoTable = (props: ExtrinsicInfoTableProps) => {
	const {network, extrinsic} = props;

	return (
		<InfoTable
			data={extrinsic.data}
			loading={extrinsic.loading}
			notFound={extrinsic.notFound}
			notFoundMessage="No extrinsic found"
			error={extrinsic.error}
		>
			<ExtrinsicInfoTableAttribute
				label="Network"
				render={(data) =>
					<NetworkBadge network={data.network} />
				}
			/>
			<ExtrinsicInfoTableAttribute
				label="Timestamp"
				render={(data) =>
					<Time time={data.timestamp} timezone utc />
				}
			/>
			<ExtrinsicInfoTableAttribute
				label="Block time"
				render={(data) =>
					<Time time={data.timestamp} fromNow />
				}
			/>
			<ExtrinsicInfoTableAttribute
				label="Hash"
				render={(data) => data.hash}
				copyToClipboard={(data) => data.hash}
			/>
			<ExtrinsicInfoTableAttribute
				label="Block"
				render={(data) =>
					<BlockLink network={network} id={data.blockId} />
				}
				copyToClipboard={(data) => data.blockHeight.toString()}
			/>
			<ExtrinsicInfoTableAttribute
				label="Account"
				render={(data) => data.signer &&
					<AccountAddress
						network={network}
						address={data.signer}
					/>
				}
				copyToClipboard={(data) => data.signer &&
					encodeAddress(data.signer, network.prefix)
				}
				hide={(data) => !data.signer}
			/>
			<ExtrinsicInfoTableAttribute
				label="Result"
				render={(data) =>
					<Chip
						variant="outlined"
						icon={<img src={data.success ? CheckIcon : CrossIcon}  />}
						label={data.success ? "Success" : "Fail"}
					/>
				}
			/>
			<ExtrinsicInfoTableAttribute
				label="Name"
				render={(data) =>
					<ButtonLink
						to={`/search/extrinsics?query=${data.palletName}.${data.callName}&network=${network.name}`}
						size="small"
						color="secondary"
					>
						{data.palletName}.{data.callName}
					</ButtonLink>
				}
			/>
			<ExtrinsicInfoTableAttribute
				label="Parameters"
				render={(data) =>
					<DataViewer
						network={network}
						data={data.args}
						metadata={data.metadata.call?.args}
						copyToClipboard
					/>
				}
			/>
			<ExtrinsicInfoTableAttribute
				label="Error"
				render={(data) => <DataViewer network={network} data={data.error} copyToClipboard />}
				hide={(data) => !data.error}
			/>
			<ExtrinsicInfoTableAttribute
				label="Fee"
				render={(data) => data.fee?.toString()}
				hide={(data) => !data.fee || data.fee === BigInt(0)}
			/>
			<ExtrinsicInfoTableAttribute
				label="Signature"
				render={(data) => data.signature &&
					<DataViewer
						simple
						network={network}
						data={data.signature}
						copyToClipboard
					/>
				}
				hide={(data) => !data.signature}
			/>
			<ExtrinsicInfoTableAttribute
				label="Spec version"
				render={(data) => data.specVersion}
			/>
		</InfoTable>
	);
};
