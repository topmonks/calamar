import { test } from "../test";
import { useRequestFixture } from "../utils/useRequestFixture";
import { TestItem } from "./templates/model";
import { testItemError } from "./templates/testItemError";
import { testItemInfo } from "./templates/testItemInfo";
import { testRedirect } from "./templates/testRedirect";
import { testRelatedItems } from "./templates/testRelatedItems";
import { mockRequestsWithFixture } from "./templates/utils";

test.describe("Runtime page", () => {
	test.describe("network spec", () => {
		const url = "/polkadot/runtime/1000001";

		const runtime: TestItem = {
			name: "runtime",
			requests: [{
				queryProp: "metadata",
				squidType: "archive",
				dataType: "items"
			}],
		};

		const pallets: TestItem = {
			name: "pallet",
			requests: []
		};

		mockRequestsWithFixture(runtime, [
			pallets,
		]);

		//testItemInfo(url, runtime);

		testRelatedItems(url, runtime, pallets, {
			hasTab: false
		});

		testRedirect("redirects to latest spec version", "/polkadot/runtime", url);

		test.describe("pallet", () => {
			const url = "/polkadot/runtime/1000001/balances";

			const calls: TestItem = {
				name: "call",
				requests: []
			};

			const events: TestItem = {
				name: "event",
				requests: []
			};

			const constants: TestItem = {
				name: "constant",
				requests: []
			};

			const storages: TestItem = {
				name: "storage",
				requests: []
			};

			const errors: TestItem = {
				name: "error",
				requests: []
			};

			testRelatedItems(url, runtime, calls);
			testRelatedItems(url, runtime, events);
			testRelatedItems(url, runtime, constants);
			testRelatedItems(url, runtime, storages);
			testRelatedItems(url, runtime, errors);

			test.describe("call", () => {
				const url = "/polkadot/runtime/1000001/balances/calls/force_set_balance";

				const call: TestItem = {
					name: "runtime-call",
					requests: []
				};

				testItemInfo(url, call);
			});

			test.describe("event", () => {
				const url = "/polkadot/runtime/1000001/balances/events/balanceset";

				const event: TestItem = {
					name: "runtime-event",
					requests: []
				};

				testItemInfo(url, event);
			});

			test.describe("constant", () => {
				const url = "/polkadot/runtime/1000001/balances/constants/existentialdeposit";

				const constant: TestItem = {
					name: "runtime-constant",
					requests: []
				};

				testItemInfo(url, constant);
			});

			test.describe("storage", () => {
				const url = "/polkadot/runtime/1000001/balances/storages/account";

				const storage: TestItem = {
					name: "runtime-storage",
					requests: []
				};

				testItemInfo(url, storage);
			});

			test.describe("error", () => {
				const url = "/polkadot/runtime/1000001/balances/errors/deadaccount";

				const error: TestItem = {
					name: "runtime-error",
					requests: []
				};

				testItemInfo(url, error);
			});
		});
	});
});
