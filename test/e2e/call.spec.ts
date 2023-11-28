import { test } from "../test";

import { TestItem } from "./templates/model";
import { testItemError } from "./templates/testItemError";
import { testItemInfo } from "./templates/testItemInfo";
import { testItemNotFound } from "./templates/testItemNotFound";
import { testRedirect } from "./templates/testRedirect";
import { testRelatedItems } from "./templates/testRelatedItems";
import { testRelatedItemsError } from "./templates/testRelatedItemsError";
import { mockRequestsWithFixture } from "./templates/utils";

test.describe("Call detail page", () => {
	const url = "/polkadot/call/18278717-3";

	const call: TestItem = {
		name: "call",
		requests: [{
			squidType: "gs-explorer",
			queryProp: "calls",
			variables: {
				filter: {
					block: {
						height_eq: 18278717
					},
					extrinsic: {
						indexInBlock_eq: 3
					},
					parentId_isNull: true
				}
			},
			dataType: "items"
		},{
			squidType: "archive",
			queryProp: "calls",
			variables: {
				ids: [ "0018278717-000003-673df" ]
			},
			dataType: "items"
		}]
	};

	const relatedEvents: TestItem = {
		name: "event",
		requests: [{
			squidType: "gs-explorer",
			queryProp: "eventsConnection",
			variables: {
				filter: {
					call: {
						id_eq: "0018278717-000003-673df"
					}
				}
			},
			dataType: "itemsConnection"
		}]
	};

	mockRequestsWithFixture(call, [
		relatedEvents
	]);

	testItemInfo(url, call);
	testItemNotFound(url, call);
	testItemError(url, call);

	testRelatedItems(url, call, relatedEvents);
	testRelatedItemsError(url, call, relatedEvents, relatedEvents.requests);

	testRedirect(
		"redirects to simplified ID",
		"/polkadot/call/0018278717-000003-673df",
		"/polkadot/call/18278717-3"
	);
});
