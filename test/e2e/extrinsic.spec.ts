import { test } from "../test";

import { TestItem } from "./templates/model";
import { testItemError } from "./templates/testItemError";
import { testItemInfo } from "./templates/testItemInfo";
import { testItemNotFound } from "./templates/testItemNotFound";
import { testRedirect } from "./templates/testRedirect";
import { testRelatedItems } from "./templates/testRelatedItems";
import { testRelatedItemsError } from "./templates/testRelatedItemsError";
import { mockRequestsWithFixture } from "./templates/utils";

test.describe("Extrinsic detail page", () => {
	const url = "/polkadot/extrinsic/18278717-3";

	const extrinsic: TestItem = {
		name: "extrinsic",
		requests: [{
			squidType: "archive",
			queryProp: "extrinsics",
			variables: {
				filter: {
					block: {
						height_eq: 18278717
					},
					indexInBlock_eq: 3
				}
			},
			dataType: "items"
		}]
	};

	const relatedCalls: TestItem = {
		name: "call",
		requests: [{
			squidType: "gs-explorer",
			queryProp: "callsConnection",
			variables: {
				filter: {
					extrinsic: {
						id_eq: "0018278717-000003-673df"
					}
				}
			},
			dataType: "itemsConnection"
		}]
	};

	const relatedEvents: TestItem = {
		name: "event",
		requests: [{
			squidType: "gs-explorer",
			queryProp: "eventsConnection",
			variables: {
				filter: {
					extrinsic: {
						id_eq: "0018278717-000003-673df"
					}
				}
			},
			dataType: "itemsConnection"
		}, {
			squidType: "archive",
			queryProp: "events",
			dataType: "items"
		}]
	};

	mockRequestsWithFixture(extrinsic, [
		relatedCalls,
		relatedEvents
	]);

	testItemInfo(url, extrinsic);
	testItemNotFound(url, extrinsic);
	testItemError(url, extrinsic);

	testRelatedItems(url, extrinsic, relatedCalls);
	testRelatedItemsError(url, extrinsic, relatedCalls, relatedCalls.requests);

	testRelatedItems(url, extrinsic, relatedEvents);
	testRelatedItemsError(url, extrinsic, relatedEvents, relatedEvents.requests);

	testRedirect(
		"redirects to simplified ID",
		"/polkadot/extrinsic/0018278717-000003-673df",
		"/polkadot/extrinsic/18278717-3"
	);
});
