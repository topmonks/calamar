import { Configuration } from "rollbar";

export const rollbarConfig: Configuration = {
	accessToken: "b77acc9bf30b42d38c6d0fb9f42133a2",
	captureUncaught: true,
	captureUnhandledRejections: true,
	payload: {
		environment: process.env.REACT_APP_ENV || process.env.NODE_ENV,
		client: {
			javascript: {
				code_version: process.env.REACT_APP_VERSION,
				source_map_enabled: true
			}
		}
	}
};
