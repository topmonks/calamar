import { test } from "../test";

import { TestItem } from "./templates/model";
import { testItemError } from "./templates/testItemError";
import { testItemInfo } from "./templates/testItemInfo";
import { testItemNotFound } from "./templates/testItemNotFound";
import { testRedirect } from "./templates/testRedirect";
import { mockRequestsWithFixture } from "./templates/utils";

test.describe("Event detail page", () => {
	const url = "/polkadot/event/18278717-51";

	const event: TestItem = {
		name: "event",
		requests: [{
			squidType: "gs-explorer",
			queryProp: "events",
			variables: {
				filter: {
					blockNumber_eq: 18278717,
					indexInBlock_eq: 51
				}
			},
			dataType: "items"
		}, {
			squidType: "archive",
			queryProp: "events",
			variables: {
				ids: ["0018278717-000051-673df"]
			},
			dataType: "items"
		}]
	};

	mockRequestsWithFixture(event);

	testItemInfo(url, event);
	testItemNotFound(url, event);
	testItemError(url, event);

	testRedirect(
		"redirects to simplified ID",
		"/polkadot/event/0018278717-000051-673df",
		"/polkadot/event/18278717-51"
	);
});
