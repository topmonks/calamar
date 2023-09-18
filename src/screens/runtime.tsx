import { Navigate, useNavigate, useParams } from "react-router-dom";
import { MenuItem, Select } from "@mui/material";

import { Card, CardHeader } from "../components/Card";
import { Devtool } from "../components/Devtool";
import { useRuntimeMetadata } from "../hooks/useRuntimeMetadata";
import { useRuntimeSpecVersions } from "../hooks/useRuntimeSpecVersions";
import { useNetworkLoaderData } from "../hooks/useRootLoaderData";

export type RuntimeParams = {
	specVersion?: string;
};

export const RuntimePage = () => {
	const { network } = useNetworkLoaderData();
	const { specVersion } = useParams() as RuntimeParams;

	const navigate = useNavigate();

	const runtimeVersions = useRuntimeSpecVersions(network.name);
	const metadata = useRuntimeMetadata(network.name, specVersion ? parseInt(specVersion) : undefined, {
		skip: !specVersion
	});

	console.log(metadata);

	if (runtimeVersions.loading) {
		return null;
	}

	if (!specVersion) {
		return <Navigate to={`/${network.name}/runtime/${runtimeVersions.data![0]}`} />;
	}

	return (
		<>
			<Card>
				<CardHeader>
					<Devtool />{network.displayName} runtime
				</CardHeader>
				<Select value={specVersion} onChange={e => navigate(`/${network.name}/runtime/${e.target.value}`)}>
					{runtimeVersions.data?.map(version =>
						<MenuItem key={version} value={version}>
							{version}
						</MenuItem>
					)}
				</Select>
				See console
				{metadata.data &&
					<ul>
						{metadata.data.pallets.map(pallet =>
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
};
