const buildTimeEnv = process.env;
const runtimeEnv = window.env;
const url = new URL(window.location.href);

export const config = {
	rollbar: {
		enabled: runtimeEnv.REACT_APP_ROLLBAR_ENABLED === "true",
		environment: runtimeEnv.REACT_APP_ROLLBAR_ENV,
		accessToken: buildTimeEnv.REACT_APP_ROLLBAR_TOKEN
	},
	app: {
		commitSha: buildTimeEnv.REACT_APP_COMMIT_SHA,
		buildTimestamp: buildTimeEnv.REACT_APP_BUILD_TIMESTAMP,
		publishTimestamp: runtimeEnv.REACT_APP_PUBLISH_TIMESTAMP
	},
	devtools: {
		enabled: (url.hostname === "localhost" && url.searchParams.get("devtools") !== "0") || url.searchParams.get("devtools") === "1"
	}
};
