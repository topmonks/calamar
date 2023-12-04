import { useMemo } from "react";

import { Network } from "../../model/network";
import { RuntimeMetadataArg } from "../../model/runtime-metadata/runtimeMetadataArg";

import { DataViewer } from "../DataViewer";

export interface RuntimeMetadataArgs {
	network: Network;
	args: RuntimeMetadataArg[];
}

export const RuntimeMetadataArgsViewer = (props: RuntimeMetadataArgs) => {
	const {network, args} = props;

	const decoratedArgs = useMemo(() => {
		return args.map(it => ({
			[it.name]: it.typeName
				? {
					value: it.type,
					__kind: it.typeName?.replace(/<T>|T::/, "")
				}
				: it.type
		}));
	}, [args]);

	return (
		<DataViewer network={network} data={decoratedArgs} rawData={args} />
	);
};
