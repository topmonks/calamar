import { test } from "../test";

import { testItemInfo } from "./templates/testItemInfo";
import { TestItem } from "./templates/model";
import { testItemNotFound } from "./templates/testItemNotFound";
import { testItemError } from "./templates/testItemError";
import { testRelatedItems } from "./templates/testRelatedItems";
import { testRelatedItemsError } from "./templates/testRelatedItemsError";
import { mockRequestsWithFixture } from "./templates/utils";
import { testRedirect } from "./templates/testRedirect";

test.describe("Block detail page", () => {
	const url = "/polkadot/block/18278717";

	const block: TestItem = {
		name: "block",
		requests: [{
			queryProp: "blocks",
			squidType: "gs-explorer",
			variables: {
				filter: {
					height_eq: 18278717
				}
			},
			dataType: "items"
		}]
	};

	const relatedExtrinsics: TestItem = {
		name: "extrinsic",
		requests: [{
			squidType: "gs-explorer",
			queryProp: "extrinsicsConnection",
			variables: {
				filter: {
					block: {
						id_eq: "0018278717-673df"
					}
				}
			},
			dataType: "itemsConnection"
		}]
	};

	const relatedCalls: TestItem = {
		name: "call",
		requests: [{
			squidType: "gs-explorer",
			queryProp: "callsConnection",
			variables: {
				filter: {
					block: {
						id_eq: "0018278717-673df"
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
					block: {
						id_eq: "0018278717-673df"
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

	mockRequestsWithFixture(block, [
		relatedExtrinsics,
		relatedCalls,
		relatedEvents
	]);

	testItemInfo(url, block);
	testItemNotFound(url, block);
	testItemError(url, block);

	testRelatedItems(url, block, relatedExtrinsics);
	testRelatedItemsError(url, block, relatedExtrinsics, relatedExtrinsics.requests);

	testRelatedItems(url, block, relatedCalls);
	testRelatedItemsError(url, block, relatedCalls, relatedCalls.requests);

	testRelatedItems(url, block, relatedEvents);
	testRelatedItemsError(url, block, relatedEvents, relatedEvents.requests);

	testRedirect(
		"redirects to simplified ID",
		"/polkadot/block/0018278717-673df",
		"/polkadot/block/18278717"
	);
});
