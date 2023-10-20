import { Chip } from "@mui/material";

import CrossIcon from "../../assets/cross-icon.png";
import CheckIcon from "../../assets/check-icon.png";

import { Call } from "../../model/call";
import { Network } from "../../model/network";
import { Resource } from "../../model/resource";

import { encodeAddress } from "../../utils/address";

import { AccountAddress } from "../AccountAddress";
import { ButtonLink } from "../ButtonLink";
import DataViewer from "../DataViewer";
import { InfoTable, InfoTableAttribute } from "../InfoTable";
import { Link } from "../Link";
import { Time } from "../Time";

export type CallInfoTableProps = {
	network: Network;
	call: Resource<Call>;
}

const CallInfoTableAttribute = InfoTableAttribute<Call>;

export const CallInfoTable = (props: CallInfoTableProps) => {
	const {network, call} = props;

	return (
		<InfoTable
			data={call.data}
			loading={call.loading}
			notFound={call.notFound}
			notFoundMessage="No call found"
			error={call.error}
		>
			<CallInfoTableAttribute
				label="Timestamp"
				render={(data) =>
					<Time time={data.timestamp} utc />
				}
			/>
			<CallInfoTableAttribute
				label="Block time"
				render={(data) =>
					<Time time={data.timestamp} fromNow />
				}
			/>
			<CallInfoTableAttribute
				label="Block"
				render={(data) =>
					<Link to={`/${network.name}/block/${data.blockId}`}>
						{data.blockHeight}
					</Link>
				}
				copyToClipboard={(data) => data.blockId}
			/>
			<CallInfoTableAttribute
				label="Extrinsic"
				render={(data) =>
					<Link to={`/${network.name}/extrinsic/${data.extrinsicId}`}>
						{data.extrinsicId}
					</Link>
				}
				copyToClipboard={(data) => data.extrinsicId}
			/>
			<CallInfoTableAttribute
				label="Parent call"
				render={(data) => data.parentId &&
					<Link to={`/${network.name}/call/${data.parentId}`}>
						{data.parentId}
					</Link>
				}
				copyToClipboard={(data) => data.parentId}
				hide={(data) => !data.parentId}
			/>
			<CallInfoTableAttribute
				label="Sender"
				render={(data) => data.caller &&
					<AccountAddress
						network={network}
						address={data.caller}
					/>
				}
				copyToClipboard={(data) => data.caller &&
					encodeAddress(data.caller, network.prefix)
				}
				hide={(data) => !data.caller}
			/>
			<CallInfoTableAttribute
				label="Result"
				render={(data) =>
					<Chip
						variant="outlined"
						icon={<img src={data.success ? CheckIcon : CrossIcon}  />}
						label={data.success ? "Success" : "Fail"}
					/>
				}
			/>
			<CallInfoTableAttribute
				label="Name"
				render={(data) =>
					<ButtonLink
						to={`/${network.name}/search?query=${data.palletName}.${data.callName}`}
						size="small"
						color="secondary"
					>
						{data.palletName}.{data.callName}
					</ButtonLink>
				}
			/>
			<CallInfoTableAttribute
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
			<CallInfoTableAttribute
				label="Spec version"
				render={(data) => data.specVersion}
			/>
		</InfoTable>
	);
};
