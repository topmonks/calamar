import path from "path";

import { getTestSpecFile } from "./getTestSpecFile";

export function getTestFixturesDir() {
	return path.join(path.dirname(getTestSpecFile()), "fixtures");
}
