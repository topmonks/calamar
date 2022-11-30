import { Chip } from "@mui/material";

import CrossIcon from "../../assets/cross-icon.png";
import CheckIcon from "../../assets/check-icon.png";

import { encodeAddress } from "../../utils/formatAddress";
import { getSignatureAddress, getSignatureValue } from "../../utils/signature";

import { AccountAddress } from "../AccountAddress";
import DataViewer from "../DataViewer";
import { InfoTable, InfoTableAttribute } from "../InfoTable";
import { Link } from "../Link";
import { Time } from "../Time";
import { ButtonLink } from "../ButtonLink";

import { DecodedMetadata } from "../../model/decodedMetadata";
import { Resource } from "../../model/resource";
import { RuntimeSpec } from "../../model/runtimeSpec";
import { getCallMetadataByName } from "../../utils/queryMetadata";

export type ExtrinsicInfoTableProps = {
	network: string;
	extrinsic: Resource;
	runtimeSpecs: Resource<RuntimeSpec[]>;
}

const ExtrinsicInfoTableAttribute = InfoTableAttribute<any, [DecodedMetadata]>;

export const ExtrinsicInfoTable = (props: ExtrinsicInfoTableProps) => {
	const {network, extrinsic, runtimeSpecs} = props;

	return (
		<InfoTable
			data={extrinsic.data}
			additionalData={[runtimeSpecs.data?.[0]?.metadata]}
			loading={extrinsic.loading || runtimeSpecs.loading}
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
			<InfoTableAttribute
				label="Block time"
				render={(data) =>
					<Time time={data.block.timestamp} fromNow />
				}
			/>
			<InfoTableAttribute
				label="Hash"
				render={(data) => data.hash}
				copyToClipboard={(data) => data.hash}
			/>
			<InfoTableAttribute
				label="Block"
				render={(data) =>
					<Link to={`/${network}/block/${data.block.id}`}>
						{data.block.height}
					</Link>
				}
				copyToClipboard={(data) => data.block.height}
			/>
			<InfoTableAttribute
				label="Account"
				render={(data) => data.signature &&
					<AccountAddress
						network={network}
						address={getSignatureAddress(data.signature)}
					/>
				}
				copyToClipboard={(data) => data.signature &&
					encodeAddress(network, getSignatureAddress(data.signature))
				}
				hide={(data) => !data.signature}
			/>
			<InfoTableAttribute
				label="Result"
				render={(data) =>
					<Chip
						variant="outlined"
						icon={<img src={data.success ? CheckIcon : CrossIcon}  />}
						label={data.success ? "Success" : "Fail"}
					/>
				}
			/>
			<InfoTableAttribute
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
				render={(data, metadata) =>
					<DataViewer
						network={network}
						data={data.call.args}
						metadata={metadata && getCallMetadataByName(metadata, data.call.name)?.args}
						copyToClipboard
					/>
				}
			/>
			<InfoTableAttribute
				label="Error"
				render={(data) => <DataViewer network={network} data={data.error} copyToClipboard />}
				hide={(data) => !data.error}
			/>
			<InfoTableAttribute
				label="Fee"
				render={(data) => data.fee}
				hide={(data) => !Number.isInteger(data.fee)}
			/>
			<InfoTableAttribute
				label="Signature"
				render={(data) =>
					<DataViewer
						simple
						network={network}
						data={getSignatureValue(data.signature)}
						copyToClipboard
					/>
				}
				hide={(data) => !data.signature}
			/>
			<InfoTableAttribute
				label="Spec version"
				render={(data) => data.block.spec.specVersion}
			/>
		</InfoTable>
	);
};
