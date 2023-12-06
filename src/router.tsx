import { LoaderFunctionArgs, Navigate, RouteObject, createBrowserRouter, redirect } from "react-router-dom";

import { ResultLayout } from "./components/ResultLayout";
import { RuntimeMetadataLoader } from "./components/RuntimeMetadataLoader";

import { encodeAddress } from "./utils/address";

import { AccountPage } from "./screens/account";
import { BlockPage } from "./screens/block";
import { CallPage } from "./screens/call";
import { ErrorPage } from "./screens/error";
import { EventPage } from "./screens/event";
import { ExtrinsicPage } from "./screens/extrinsic";
import { HomePage } from "./screens/home";
import { NetworkPage } from "./screens/network";
import { NotFoundPage } from "./screens/notFound";
import { SearchPage } from "./screens/search";
import { RuntimePalletPage, RuntimePage, RuntimePalletsPage, RuntimeCallPage, RuntimeEventPage, RuntimeConstantPage, RuntimeStoragePage, RuntimeErrorPage } from "./screens/runtime";

import { simplifyCallId } from "./services/callsService";
import { simplifyBlockId } from "./services/blocksService";
import { simplifyExtrinsicId } from "./services/extrinsicsService";
import { simplifyEventId } from "./services/eventsService";
import { getNetwork } from "./services/networksService";
import { normalizeCallName, normalizeConstantName, normalizeErrorName, normalizeEventName, normalizePalletName, normalizeStorageName } from "./services/runtimeMetadataService";

const networkLoader = ({ params }: LoaderFunctionArgs) => {
	const { network: networkName } = params as { network: string };

	try {
		const network = getNetwork(networkName);
		return { network };
	} catch (e) {
		throw new Response("Network not found", {status: 404});
	}
};

export const routes: RouteObject[] = [
	{
		element: <RuntimeMetadataLoader />,
		children: [
			{
				index: true,
				element: <HomePage />,
			},
			{
				element: <ResultLayout />,
				children: [
					{
						path: "search/:tab?",
						element: <SearchPage />,
						errorElement: <ErrorPage />,
					},
					{
						id: "network",
						path: ":network",
						loader: networkLoader,
						errorElement: <ErrorPage />,
						children: [
							{
								path: ":tab?",
								element: <NetworkPage />,
							},
							{
								path: "block/:id/:tab?",
								element: <BlockPage />,
								loader: (args) => {
									const { params } = args;
									const { id } = params as { id: string };

									const simplifiedId = simplifyBlockId(id);

									if (id !== simplifiedId) {
										const { network } = networkLoader(args);
										return redirect(`/${network.name}/block/${simplifiedId}`);
									}

									return null;
								}
							},
							{
								path: "extrinsic/:id/:tab?",
								element: <ExtrinsicPage />,
								loader: (args) => {
									const { params } = args;
									const { id } = params as { id: string };

									const simplifiedId = simplifyExtrinsicId(id);

									if (id !== simplifiedId) {
										const { network } = networkLoader(args);
										return redirect(`/${network.name}/extrinsic/${simplifiedId}`);
									}

									return null;
								}
							},
							{
								path: "call/:id/:tab?",
								element: <CallPage />,
								loader: (args) => {
									const { params } = args;
									const { id } = params as { id: string };

									const simplifiedId = simplifyCallId(id);

									if (id !== simplifiedId) {
										const { network } = networkLoader(args);
										return redirect(`/${network.name}/call/${simplifiedId}`);
									}

									return null;
								}
							},
							{
								path: "event/:id",
								element: <EventPage />,
								loader: (args) => {
									const { params } = args;
									const { id } = params as { id: string };

									const simplifiedId = simplifyEventId(id);

									if (id !== simplifiedId) {
										const { network } = networkLoader(args);
										return redirect(`/${network.name}/event/${simplifiedId}`);
									}

									return null;
								}
							},
							{
								path: "account/:address/:tab?",
								element: <AccountPage />,
								loader: (args) => {
									const { params } = args;
									const { address } = params as { address: string };

									const { network } = networkLoader(args);

									const encodedAddress = encodeAddress(address, network.prefix);
									if (address !== encodedAddress) {
										return redirect(`/${network.name}/account/${encodedAddress}`);
									}

									return null;
								}
							},
							{
								path: "latest-extrinsics",
								element: <Navigate to="../extrinsics" replace />,
							},
							{
								path: "runtime",
								children: [
									{
										index: true,
										element: <RuntimePage />,
									},
									{
										path: ":specVersion",
										children: [
											{
												index: true,
												element: <RuntimePalletsPage />,
											},
											{
												id: "runtime-pallet",
												path: ":palletName",
												loader: async (args) => {
													const { params } = args;
													const { specVersion, palletName } = params as { specVersion: string, palletName: string };

													const { network } = networkLoader(args);

													console.log("pallet loader", specVersion, palletName);

													return {
														palletName: await normalizePalletName(network, palletName, specVersion)
													};
												},
												children: [
													{
														path: ":tab?",
														element: <RuntimePalletPage />,
													},
													{
														id: "runtime-call",
														path: "calls/:callName",
														loader: async (args) => {
															const { params } = args;
															const { specVersion, palletName, callName } = params as { specVersion: string, palletName: string, callName: string };

															const { network } = networkLoader(args);

															const callFullName = `${palletName}.${callName}`;
															const normalizedCallFullName = await normalizeCallName(network, callFullName, specVersion);

															return {
																callName: normalizedCallFullName.split(".")[1] as string
															};
														},
														element: <RuntimeCallPage />
													},
													{
														id: "runtime-event",
														path: "events/:eventName",
														loader: async (args) => {
															const { params } = args;
															const { specVersion, palletName, eventName } = params as { specVersion: string, palletName: string, eventName: string };

															const { network } = networkLoader(args);

															const eventFullName = `${palletName}.${eventName}`;
															const normalizedEventFullName = await normalizeEventName(network, eventFullName, specVersion);

															return {
																eventName: normalizedEventFullName.split(".")[1] as string
															};
														},
														element: <RuntimeEventPage />
													},
													{
														id: "runtime-constant",
														path: "constants/:constantName",
														loader: async (args) => {
															const { params } = args;
															const { specVersion, palletName, constantName } = params as { specVersion: string, palletName: string, constantName: string };

															const { network } = networkLoader(args);

															const constantFullName = `${palletName}.${constantName}`;
															const normalizedConstantFullName = await normalizeConstantName(network, constantFullName, specVersion);

															return {
																constantName: normalizedConstantFullName.split(".")[1] as string
															};
														},
														element: <RuntimeConstantPage />
													},
													{
														id: "runtime-storage",
														path: "storages/:storageName",
														loader: async (args) => {
															const { params } = args;
															const { specVersion, palletName, storageName } = params as { specVersion: string, palletName: string, storageName: string };

															const { network } = networkLoader(args);

															const storageFullName = `${palletName}.${storageName}`;
															const normalizedStorageFullName = await normalizeStorageName(network, storageFullName, specVersion);

															return {
																storageName: normalizedStorageFullName.split(".")[1] as string
															};
														},
														element: <RuntimeStoragePage />
													},
													{
														id: "runtime-error",
														path: "errors/:errorName",
														loader: async (args) => {
															const { params } = args;
															const { specVersion, palletName, errorName } = params as { specVersion: string, palletName: string, errorName: string };

															const { network } = networkLoader(args);

															const errorFullName = `${palletName}.${errorName}`;
															const normalizedErrorFullName = await normalizeErrorName(network, errorFullName, specVersion);

															return {
																errorName: normalizedErrorFullName.split(".")[1] as string
															};
														},
														element: <RuntimeErrorPage />
													}
												]
											},
										]
									}
								]
							},
							{
								path: "*",
								element: <NotFoundPage />,
							},
						],
					},
				]
			}
		]
	}
];

export const router = createBrowserRouter(routes, {
	basename: window.location.hostname === "localhost"
		? undefined
		: process.env.PUBLIC_URL
});
