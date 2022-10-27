import { defineConfig } from "cypress";

export default defineConfig({
	e2e: {
		projectId: "v93z86",
		baseUrl: "http://localhost:3000",
		viewportWidth: 1920,
		viewportHeight: 1080,
		video: false,
		setupNodeEvents(on, config) {
			// let's increase the browser window size when running headlessly
			// this will produce higher resolution images and videos
			// https://on.cypress.io/browser-launch-api
			on("before:browser:launch", (browser, launchOptions) => {
				const width = config.viewportWidth;
				const height = config.viewportHeight;

				if (browser.name === "chrome" && browser.isHeadless) {
					launchOptions.args.push(`--window-size=${width},${height}`);

					// force screen to be non-retina and just use our given resolution
					launchOptions.args.push("--force-device-scale-factor=1");
				}

				if (browser.name === "electron" && browser.isHeadless) {
					// might not work on CI for some reason
					launchOptions.preferences.width = width;
					launchOptions.preferences.height = height;
				}

				if (browser.name === "firefox" && browser.isHeadless) {
					launchOptions.args.push(`--width=${width}`);
					launchOptions.args.push(`--height=${height}`);
				}

				return launchOptions;
			});
		},
	},
});
