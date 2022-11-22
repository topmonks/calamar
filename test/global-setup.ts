import fs from "fs";

import config from "../playwright.config";

async function globalSetup() {
	fs.rmSync(config.screenshotsDir, {recursive: true, force: true});
}

export default globalSetup;
