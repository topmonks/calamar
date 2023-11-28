import Rollbar, { Configuration } from "rollbar";

import { config } from "./config";

export const rollbarConfig: Configuration = {
	accessToken: config.rollbar.accessToken || "dummy-token",
	captureUncaught: true,
	captureUnhandledRejections: true,
	payload: {
		environment: config.rollbar.environment,
		server: {
			root: "/"
		},
		client: {
			javascript: {
				code_version: config.app.commitSha,
				source_map_enabled: true,
				guess_uncaught_frames: true
			}
		},
	},
	enabled: config.rollbar.enabled
};

const rollbar = new Rollbar(rollbarConfig);

if (!config.rollbar.enabled && window.location.hostname === "localhost") {
	// if the rollbar is disabled on localhost, print
	// the message about reporting to the console
	// so it is obvious when it would happen

	const notifier = (rollbar as any).client.notifier;
	const log = notifier.log;

	notifier.log = function (item: any, callback: any) {
		console.warn(`The following ${item.level} item would be reported to Rollbar`);

		if (!item._isUncaught) {
			const consoleAction = ["error", "critical"].includes(item.level) ? "error" : "warn";
			console[consoleAction](...item._originalArgs);
		}

		log.apply(this, [item, callback]);
	};
}

export { rollbar };
