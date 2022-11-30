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

export const rollbar = new Rollbar(rollbarConfig);
