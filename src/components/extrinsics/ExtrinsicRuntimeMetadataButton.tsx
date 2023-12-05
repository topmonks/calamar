import { Extrinsic } from "../../model/extrinsic";

import { RuntimeMetadataButton } from "../runtime/RuntimeMetadataButton";

export interface ExtrinsicRuntimeMetadataButtonProps {
	extrinsic: Extrinsic;
}

export const ExtrinsicRuntimeMetadataButton = (props: ExtrinsicRuntimeMetadataButtonProps) => {
	const {extrinsic} = props;

	if (!extrinsic.metadata.call) {
		return null;
	}

	return (
		<RuntimeMetadataButton
			title={`${extrinsic.palletName}.${extrinsic.callName}`}
			description={extrinsic.metadata.call.description}
			link={`/${extrinsic.network.name}/runtime/${extrinsic.specVersion}/${extrinsic.palletName}/calls/${extrinsic.callName}`}
		/>
	);
};
