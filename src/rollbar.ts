import { Configuration } from "rollbar";

export const rollbarConfig: Configuration = {
	accessToken: process.env.REACT_APP_ROLLBAR_TOKEN,
	captureUncaught: true,
	captureUnhandledRejections: true,
	payload: {
		environment: window.env.REACT_APP_ROLLBAR_ENV,
		client: {
			javascript: {
				code_version: window.env.REACT_APP_VERSION,
				source_map_enabled: true,
				guess_uncaught_frames: true
			}
		},
	},
	enabled: window.env.REACT_APP_ROLLBAR_ENABLED === "true"
};
