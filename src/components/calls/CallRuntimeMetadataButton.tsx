import { Call } from "../../model/call";

import { RuntimeMetadataButton } from "../runtime/RuntimeMetadataButton";

export interface CallRuntimeMetadataButtonProps {
	call: Call;
}

export const CallRuntimeMetadataButton = (props: CallRuntimeMetadataButtonProps) => {
	const {call} = props;

	if (!call.metadata.call) {
		return null;
	}

	return (
		<RuntimeMetadataButton
			title={`${call.palletName}.${call.callName}`}
			description={call.metadata.call.description}
			link={`/${call.network.name}/runtime/${call.specVersion}/${call.palletName}/calls/${call.callName}`}
		/>
	);
};
