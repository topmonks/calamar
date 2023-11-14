import { LoaderFunctionArgs, Navigate, RouteObject, createBrowserRouter, redirect } from "react-router-dom";

import { ResultLayout } from "./components/ResultLayout";
import { getNetwork } from "./services/networksService";
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
import { RuntimePage } from "./screens/runtime";

import { simplifyCallId } from "./services/callsService";
import { simplifyBlockId } from "./services/blocksService";
import { simplifyExtrinsicId } from "./services/extrinsicsService";
import { simplifyEventId } from "./services/eventsService";

import { config } from "./config";

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
		path: "/",
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
						element: config.devtools.enabled ? <RuntimePage /> : <NotFoundPage />,
					},
					{
						path: "runtime/:specVersion",
						element: config.devtools.enabled ? <RuntimePage /> : <NotFoundPage />,
					},
					{
						path: "*",
						element: <NotFoundPage />,
					},
				],
			},
		]
	}
];

export const router = createBrowserRouter(routes, {
	basename: window.location.hostname === "localhost"
		? undefined
		: process.env.PUBLIC_URL
});
