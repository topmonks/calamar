import { Button, Chip } from "@mui/material";

import CrossIcon from "../../assets/cross-icon.png";
import CheckIcon from "../../assets/check-icon.png";

import { encodeAddress } from "../../utils/formatAddress";

import { AccountAddress } from "../AccountAddress";
import DataViewer from "../DataViewer";
import { InfoTable, InfoTableAttribute } from "../InfoTable";
import { Link } from "../Link";
import { Time } from "../Time";
import { ButtonLink } from "../ButtonLink";

export type ExtrinsicInfoTableProps = {
	network: string;
	data: any;
	loading?: boolean;
	notFound?: boolean;
	error?: any;
}

export const ExtrinsicInfoTable = (props: ExtrinsicInfoTableProps) => {
	const {network, data, loading, notFound, error} = props;

	return (
		<InfoTable
			data={data}
			loading={loading}
			notFound={notFound}
			notFoundMessage="No extrinsic found"
			error={error}
		>
			<InfoTableAttribute
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
				render={(data) => data.signature?.address &&
					<AccountAddress network={network} address={data.signature.address} />
				}
				copyToClipboard={(data) =>
					encodeAddress(
						network,
						data.signature?.address
					)
				}
				hide={(data) => !data.signature?.address}
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
			<InfoTableAttribute
				label="Parameters"
				render={(data) =>
					<DataViewer network={network} data={data.call.args} copyToClipboard />
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
						data={data.signature?.signature.value}
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
