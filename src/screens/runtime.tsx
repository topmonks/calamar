import { Navigate, useNavigate, useParams } from "react-router-dom";
import { MenuItem, Select } from "@mui/material";

import { Card, CardHeader } from "../components/Card";
import { DevtoolsIcon } from "../components/DevtoolsIcon";
import { useRuntimeSpecs } from "../hooks/useRuntimeSpecs";
import { useNetwork } from "../hooks/useNetwork";
import { useRuntimeSpecVersions } from "../hooks/useRuntimeSpecVersions";

type RuntimeParams = {
	network: string;
	specVersion?: string;
};

function RuntimePage() {
	const { network: networkName, specVersion } = useParams() as RuntimeParams;

	const navigate = useNavigate();

	const runtimeVersions = useRuntimeSpecVersions(networkName);
	const runtimeSpecs = useRuntimeSpecs(networkName, specVersion ? [parseInt(specVersion)] : [], {
		skip: !specVersion
	});

	const network = useNetwork(networkName)!;

	const { metadata } = runtimeSpecs.data?.[0] || {};

	console.log(metadata);

	if (runtimeVersions.loading) {
		return null;
	}

	if (!specVersion) {
		return <Navigate to={`/${networkName}/runtime/${runtimeVersions.data![0]}`} />;
	}

	return (
		<>
			<Card>
				<CardHeader>
					<DevtoolsIcon />{network.displayName} runtime
				</CardHeader>
				<Select value={specVersion} onChange={e => navigate(`/${networkName}/runtime/${e.target.value}`)}>
					{runtimeVersions.data?.map(version =>
						<MenuItem key={version} value={version}>
							{version}
						</MenuItem>
					)}
				</Select>
				See console
				{metadata &&
					<ul>
						{metadata.pallets.map(pallet =>
							<li key={pallet.name}>
								{pallet.name}
								<ul>
									{pallet.calls.length > 0 &&
										<li>
											calls
											<ul>
												{pallet.calls.map(call =>
													<li key={call.name}>
														{call.name}
														<ul>
															{call.args.map(arg =>
																<li key={arg.name}>
																	{arg.name}: {arg.type} {arg.typeName && `(${arg.typeName})`}
																</li>
															)}
														</ul>
													</li>
												)}
											</ul>
										</li>
									}
									{pallet.events.length > 0 &&
										<li>
											events
											<ul>
												{pallet.events.map(event =>
													<li key={event.name}>
														{event.name}
														<ul>
															{event.args.map(arg =>
																<li key={arg.name}>
																	{arg.name}: {arg.type} {arg.typeName && `(${arg.typeName})`}
																</li>
															)}
														</ul>
													</li>
												)}
											</ul>
										</li>
									}
								</ul>
							</li>
						)}
					</ul>
				}
			</Card>
		</>
	);
}

export default RuntimePage;
