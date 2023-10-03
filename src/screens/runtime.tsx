import { Navigate, useNavigate, useParams } from "react-router-dom";
import { MenuItem, Select } from "@mui/material";

import { Card, CardHeader } from "../components/Card";
import { Devtool } from "../components/Devtool";
import { useRuntimeSpecVersions } from "../hooks/useRuntimeSpecVersions";
import { useNetworkLoaderData } from "../hooks/useRootLoaderData";
import { useRuntimeMetadataPallets } from "../hooks/useRuntimeMetadataPallets";
import { tryParseInt } from "../utils/string";

export type RuntimeParams = {
	specVersion?: string;
};

export const RuntimePage = () => {
	const { network } = useNetworkLoaderData();
	const { specVersion } = useParams() as RuntimeParams;

	const navigate = useNavigate();

	const runtimeVersions = useRuntimeSpecVersions(network.name);
	const pallets = useRuntimeMetadataPallets(network.name, tryParseInt(specVersion), {
		skip: !specVersion
	});

	console.log(pallets);

	if (!specVersion) {
		return runtimeVersions.data
			? <Navigate to={`/${network.name}/runtime/${runtimeVersions.data[0]}`} />
			: null;
	}

	return (
		<>
			<Card>
				<CardHeader>
					<Devtool />{network.displayName} runtime
				</CardHeader>
				<Select value={specVersion} onChange={e => navigate(`/${network.name}/runtime/${e.target.value}`)}>
					{(runtimeVersions.data || [specVersion]).map(version =>
						<MenuItem key={version} value={version}>
							{version}
						</MenuItem>
					)}
				</Select>
				See console
				{pallets.data &&
					<ul>
						{pallets.data.map(pallet =>
							<li key={pallet.name}>
								{pallet.name}
							</li>
						)}
					</ul>
				}
			</Card>
		</>
	);
};
