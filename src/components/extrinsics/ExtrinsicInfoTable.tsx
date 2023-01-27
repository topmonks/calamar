import { Chip } from "@mui/material";

import CrossIcon from "../../assets/cross-icon.png";
import CheckIcon from "../../assets/check-icon.png";

import { Extrinsic } from "../../model/extrinsic";
import { Resource } from "../../model/resource";

import { encodeAddress } from "../../utils/formatAddress";
import { getCallMetadataByName } from "../../utils/queryMetadata";
import { getSignatureAddress, getSignatureValue } from "../../utils/signature";

import { AccountAddress } from "../AccountAddress";
import { ButtonLink } from "../ButtonLink";
import DataViewer from "../DataViewer";
import { InfoTable, InfoTableAttribute } from "../InfoTable";
import { Link } from "../Link";
import { Time } from "../Time";

export type ExtrinsicInfoTableProps = {
	network: string;
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
				label="Timestamp"
				render={(data) =>
					<Time time={data.block.timestamp} timezone utc />
				}
			/>
			<ExtrinsicInfoTableAttribute
				label="Block time"
				render={(data) =>
					<Time time={data.block.timestamp} fromNow />
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
					<Link to={`/${network}/block/${data.block.id}`}>
						{data.block.height}
					</Link>
				}
				copyToClipboard={(data) => data.block.height.toString()}
			/>
			<ExtrinsicInfoTableAttribute
				label="Account"
				render={(data) => data.signature &&
					<AccountAddress
						network={network}
						address={getSignatureAddress(data.signature)}
						prefix={data.runtimeSpec.metadata.ss58Prefix}
					/>
				}
				copyToClipboard={(data) => data.signature &&
					encodeAddress(
						getSignatureAddress(data.signature),
						data.runtimeSpec.metadata.ss58Prefix
					)
				}
				hide={(data) => !data.signature}
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
						to={`/${network}/search?query=${data.call.name}`}
						size="small"
						color="secondary"
					>
						{data.call.name}
					</ButtonLink>
				}
			/>
			<ExtrinsicInfoTableAttribute
				label="Parameters"
				render={(data) =>
					<DataViewer
						network={network}
						data={data.call.args}
						metadata={getCallMetadataByName(data.runtimeSpec.metadata, data.call.name)?.args}
						runtimeSpec={data.runtimeSpec}
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
				render={(data) => data.fee}
				hide={(data) => !Number.isInteger(data.fee)}
			/>
			<ExtrinsicInfoTableAttribute
				label="Signature"
				render={(data) =>
					<DataViewer
						simple
						network={network}
						data={getSignatureValue(data.signature)}
						runtimeSpec={data.runtimeSpec}
						copyToClipboard
					/>
				}
				hide={(data) => !data.signature}
			/>
			<ExtrinsicInfoTableAttribute
				label="Spec version"
				render={(data) => data.block.spec.specVersion}
			/>
		</InfoTable>
	);
};
