import { Configuration } from "rollbar";

import { config } from "./config";

export const rollbarConfig: Configuration = {
	accessToken: config.rollbar.accessToken,
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
