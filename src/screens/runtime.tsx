/** @jsxImportSource @emotion/react */
import { Navigate, useParams, useRouteLoaderData } from "react-router-dom";

import { Card, CardHeader } from "../components/Card";
import { Link } from "../components/Link";
import NotFound from "../components/NotFound";
import { RuntimePageLayout } from "../components/runtime/RuntimePageLayout";
import { TabPane, TabbedContent } from "../components/TabbedContent";

import { useTab } from "../hooks/useTab";
import { useLatestRuntimeSpecVersion } from "../hooks/useLatestRuntimeSpecVersion";
import { useNetworkLoaderData } from "../hooks/useNetworkLoaderData";

import { RuntimeMetadataCallInfoTable } from "../components/runtime/RuntimeMetadataCallInfoTable";
import { RuntimeMetadataConstantInfoTable } from "../components/runtime/RuntimeMetadataConstantInfoTable";
import { RuntimeMetadataErrorInfoTable } from "../components/runtime/RuntimeMetadataErrorInfoTable";
import { RuntimeMetadataEventInfoTable } from "../components/runtime/RuntimeMetadataEventInfoTable";
import { RuntimeMetadataStorageInfoTable } from "../components/runtime/RuntimeMetadataStorageInfoTable";

import { RuntimeMetadataCallsTable } from "../components/runtime/RuntimeMetadataCallsTable";
import { RuntimeMetadataConstantsTable } from "../components/runtime/RuntimeMetadataConstantsTable";
import { RuntimeMetadataErrorsTable } from "../components/runtime/RuntimeMetadataErrorsTable";
import { RuntimeMetadataEventsTable } from "../components/runtime/RuntimeMetadataEventsTable";
import { RuntimeMetadataPalletsTable } from "../components/runtime/RuntimeMetadataPalletsTable";
import { RuntimeMetadataStoragesTable } from "../components/runtime/RuntimeMetadataStoragesTable";

import { useRuntimeMetadataCall } from "../hooks/useRuntimeMetadataCall";
import { useRuntimeMetadataConstant } from "../hooks/useRuntimeMetadataConstant";
import { useRuntimeMetadataError } from "../hooks/useRuntimeMetadataError";
import { useRuntimeMetadataEvent } from "../hooks/useRuntimeMetadataEvent";
import { useRuntimeMetadataStorage } from "../hooks/useRuntimeMetadataStorage";

import { useRuntimeMetadataCalls } from "../hooks/useRuntimeMetadataCalls";
import { useRuntimeMetadataConstants } from "../hooks/useRuntimeMetadataConstants";
import { useRuntimeMetadataErrors } from "../hooks/useRuntimeMetadataErrors";
import { useRuntimeMetadataEvents } from "../hooks/useRuntimeMetadataEvents";
import { useRuntimeMetadataPallets } from "../hooks/useRuntimeMetadataPallets";
import { useRuntimeMetadataStorages } from "../hooks/useRuntimeMetadataStorages";

export type RuntimeParams = {
	specVersion: string;
};

export const RuntimePage = () => {
	const { network } = useNetworkLoaderData();
	const { specVersion } = useParams() as Partial<RuntimeParams>;

	const latestSpecVersion = useLatestRuntimeSpecVersion(network.name);

	if (!specVersion && latestSpecVersion.data) {
		return <Navigate to={`/${network.name}/runtime/${latestSpecVersion.data}`} replace />;
	}

	return null;
};

export const RuntimePalletsPage = () => {
	const { network } = useNetworkLoaderData();
	const { specVersion } = useParams() as RuntimeParams;

	const pallets = useRuntimeMetadataPallets(network.name, specVersion);

	return (
		<RuntimePageLayout
			network={network}
			specVersion={specVersion}
		>
			<Card data-test="related-items">
				<CardHeader>Pallets</CardHeader>
				<RuntimeMetadataPalletsTable
					network={network}
					specVersion={specVersion}
					pallets={pallets}
				/>
			</Card>
		</RuntimePageLayout>
	);
};

export type RuntimePalletPageLoaderData = {
	specVersion: number;
	palletName: string;
}

export const RuntimePalletPage = () => {
	const { network } = useNetworkLoaderData();
	const { palletName } = useRouteLoaderData("runtime-pallet") as RuntimePalletPageLoaderData;

	const { specVersion } = useParams() as RuntimeParams;

	const [tab, setTab] = useTab();

	const calls = useRuntimeMetadataCalls(network.name, specVersion, palletName);
	const events = useRuntimeMetadataEvents(network.name, specVersion, palletName);
	const constants = useRuntimeMetadataConstants(network.name, specVersion, palletName);
	const storages = useRuntimeMetadataStorages(network.name, specVersion, palletName);
	const errors = useRuntimeMetadataErrors(network.name, specVersion, palletName);

	const itemsFound = Boolean(calls.data?.length || events.data?.length || constants.data?.length);

	return (
		<RuntimePageLayout
			network={network}
			specVersion={specVersion.toString()}
			breadcrumbs={[
				<Link to={`/${network.name}/runtime/${specVersion}`}>Pallets</Link>,
				<Link to={`/${network.name}/runtime/${specVersion}/${palletName.toLowerCase()}`} className="highlighted">{palletName}</Link>,
			]}
		>
			<Card data-test="related-items">
				<CardHeader>{palletName}</CardHeader>
				{itemsFound &&
					<TabbedContent currentTab={tab} onTabChange={setTab}>
						<TabPane
							label="Calls"
							value="calls"
							loading={calls.loading}
							count={calls.data?.length}
							hide={calls.loading || calls.data?.length === 0}
						>
							<RuntimeMetadataCallsTable
								network={network}
								specVersion={specVersion.toString()}
								palletName={palletName}
								calls={calls}
							/>
						</TabPane>
						<TabPane
							label="Events"
							value="events"
							loading={events.loading}
							count={events.data?.length}
							hide={events.loading || events.data?.length === 0}
						>
							<RuntimeMetadataEventsTable
								network={network}
								specVersion={specVersion.toString()}
								palletName={palletName}
								events={events}
							/>
						</TabPane>
						<TabPane
							label="Constants"
							value="constants"
							loading={constants.loading}
							count={constants.data?.length}
							hide={constants.loading || constants.data?.length === 0}
						>
							<RuntimeMetadataConstantsTable
								network={network}
								specVersion={specVersion.toString()}
								palletName={palletName}
								constants={constants}
							/>
						</TabPane>
						<TabPane
							label="Storages"
							value="storages"
							loading={storages.loading}
							count={storages.data?.length}
							hide={storages.loading || storages.data?.length === 0}
						>
							<RuntimeMetadataStoragesTable
								network={network}
								specVersion={specVersion.toString()}
								palletName={palletName}
								storages={storages}
							/>
						</TabPane>
						<TabPane
							label="Errors"
							value="errors"
							loading={errors.loading}
							count={errors.data?.length}
							hide={errors.loading || errors.data?.length === 0}
						>
							<RuntimeMetadataErrorsTable
								network={network}
								specVersion={specVersion.toString()}
								palletName={palletName}
								errors={errors}
							/>
						</TabPane>
					</TabbedContent>
				}
				{!itemsFound && <NotFound>No items found</NotFound>}
			</Card>
		</RuntimePageLayout>
	);
};

export type RuntimeCallPageLoaderData = {
	callName: string;
}

export const RuntimeCallPage = () => {
	const { network } = useNetworkLoaderData();
	const { palletName } = useRouteLoaderData("runtime-pallet") as RuntimePalletPageLoaderData;
	const { callName } = useRouteLoaderData("runtime-call") as RuntimeCallPageLoaderData;

	const { specVersion } = useParams() as RuntimeParams;

	const call = useRuntimeMetadataCall(network.name, specVersion, palletName, callName);

	return (
		<RuntimePageLayout
			network={network}
			specVersion={specVersion.toString()}
			breadcrumbs={[
				<Link to={`/${network.name}/runtime/${specVersion}`}>Pallets</Link>,
				<Link to={`/${network.name}/runtime/${specVersion}/${palletName.toLowerCase()}`} className="highlighted">{palletName}</Link>,
				<Link to={`/${network.name}/runtime/${specVersion}/${palletName.toLowerCase()}/calls`}>Calls</Link>,
				<Link to={`/${network.name}/runtime/${specVersion}/${palletName.toLowerCase()}/calls/${callName.toLowerCase()}`} className="highlighted">{callName}</Link>,
			]}
		>
			<Card data-test="item-info">
				<CardHeader data-test="item-header">
					{palletName}.{callName}
				</CardHeader>
				<RuntimeMetadataCallInfoTable network={network} call={call} />
			</Card>
		</RuntimePageLayout>
	);
};

export type RuntimeEventPageLoaderData = {
	eventName: string;
}

export const RuntimeEventPage = () => {
	const { network } = useNetworkLoaderData();
	const { palletName } = useRouteLoaderData("runtime-pallet") as RuntimePalletPageLoaderData;
	const { eventName } = useRouteLoaderData("runtime-event") as RuntimeEventPageLoaderData;

	const { specVersion } = useParams() as RuntimeParams;

	const event = useRuntimeMetadataEvent(network.name, specVersion, palletName, eventName);

	return (
		<RuntimePageLayout
			network={network}
			specVersion={specVersion.toString()}
			breadcrumbs={[
				<Link to={`/${network.name}/runtime/${specVersion}`}>Pallets</Link>,
				<Link to={`/${network.name}/runtime/${specVersion}/${palletName.toLowerCase()}`} className="highlighted">{palletName}</Link>,
				<Link to={`/${network.name}/runtime/${specVersion}/${palletName.toLowerCase()}/events`}>Events</Link>,
				<Link to={`/${network.name}/runtime/${specVersion}/${palletName.toLowerCase()}/events/${eventName.toLowerCase()}`} className="highlighted">{eventName}</Link>,
			]}
		>
			<Card data-test="item-info">
				<CardHeader data-test="item-header">
					{palletName}.{eventName}
				</CardHeader>
				<RuntimeMetadataEventInfoTable network={network} event={event} />
			</Card>
		</RuntimePageLayout>
	);
};

export type RuntimeConstantPageLoaderData = {
	constantName: string;
}

export const RuntimeConstantPage = () => {
	const { network } = useNetworkLoaderData();
	const { palletName } = useRouteLoaderData("runtime-pallet") as RuntimePalletPageLoaderData;
	const { constantName } = useRouteLoaderData("runtime-constant") as RuntimeConstantPageLoaderData;

	const { specVersion } = useParams() as RuntimeParams;

	const constant = useRuntimeMetadataConstant(network.name, specVersion, palletName, constantName);

	return (
		<RuntimePageLayout
			network={network}
			specVersion={specVersion.toString()}
			breadcrumbs={[
				<Link to={`/${network.name}/runtime/${specVersion}`}>Pallets</Link>,
				<Link to={`/${network.name}/runtime/${specVersion}/${palletName.toLowerCase()}`} className="highlighted">{palletName}</Link>,
				<Link to={`/${network.name}/runtime/${specVersion}/${palletName.toLowerCase()}/constants`}>Constants</Link>,
				<Link to={`/${network.name}/runtime/${specVersion}/${palletName.toLowerCase()}/constants/${constantName.toLowerCase()}`} className="highlighted">{constantName}</Link>,
			]}
		>
			<Card data-test="item-info">
				<CardHeader data-test="item-header">
					{palletName}.{constantName}
				</CardHeader>
				<RuntimeMetadataConstantInfoTable network={network} constant={constant} />
			</Card>
		</RuntimePageLayout>
	);
};

export type RuntimeStoragePageLoaderData = {
	storageName: string;
}

export const RuntimeStoragePage = () => {
	const { network } = useNetworkLoaderData();
	const { palletName } = useRouteLoaderData("runtime-pallet") as RuntimePalletPageLoaderData;
	const { storageName } = useRouteLoaderData("runtime-storage") as RuntimeStoragePageLoaderData;

	const { specVersion } = useParams() as RuntimeParams;

	const storage = useRuntimeMetadataStorage(network.name, specVersion, palletName, storageName);

	return (
		<RuntimePageLayout
			network={network}
			specVersion={specVersion.toString()}
			breadcrumbs={[
				<Link to={`/${network.name}/runtime/${specVersion}`}>Pallets</Link>,
				<Link to={`/${network.name}/runtime/${specVersion}/${palletName.toLowerCase()}`} className="highlighted">{palletName}</Link>,
				<Link to={`/${network.name}/runtime/${specVersion}/${palletName.toLowerCase()}/storages`}>Storages</Link>,
				<Link to={`/${network.name}/runtime/${specVersion}/${palletName.toLowerCase()}/storages/${storageName.toLowerCase()}`} className="highlighted">{storageName}</Link>,
			]}
		>
			<Card data-test="item-info">
				<CardHeader data-test="item-header">
					{palletName}.{storageName}
				</CardHeader>
				<RuntimeMetadataStorageInfoTable network={network} storage={storage} />
			</Card>
		</RuntimePageLayout>
	);
};

export type RuntimeErrorPageLoaderData = {
	errorName: string;
}

export const RuntimeErrorPage = () => {
	const { network } = useNetworkLoaderData();
	const { palletName } = useRouteLoaderData("runtime-pallet") as RuntimePalletPageLoaderData;
	const { errorName } = useRouteLoaderData("runtime-error") as RuntimeErrorPageLoaderData;

	const { specVersion } = useParams() as RuntimeParams;

	const error = useRuntimeMetadataError(network.name, specVersion, palletName, errorName);

	return (
		<RuntimePageLayout
			network={network}
			specVersion={specVersion.toString()}
			breadcrumbs={[
				<Link to={`/${network.name}/runtime/${specVersion}`}>Pallets</Link>,
				<Link to={`/${network.name}/runtime/${specVersion}/${palletName.toLowerCase()}`} className="highlighted">{palletName}</Link>,
				<Link to={`/${network.name}/runtime/${specVersion}/${palletName.toLowerCase()}/errors`}>Errors</Link>,
				<Link to={`/${network.name}/runtime/${specVersion}/${palletName.toLowerCase()}/errors/${errorName.toLowerCase()}`} className="highlighted">{errorName}</Link>,
			]}
		>
			<Card data-test="item-info">
				<CardHeader data-test="item-header">
					{palletName}.{errorName}
				</CardHeader>
				<RuntimeMetadataErrorInfoTable error={error} />
			</Card>
		</RuntimePageLayout>
	);
};
