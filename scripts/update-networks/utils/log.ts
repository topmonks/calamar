import colors from "colors";

// overwrite console.* with noop because @polkadot/api has hardcoded logger which cannot be disabled
const consoleLog = console.log;

if (!process.argv.includes("--debug")) {
	console.log = () => {}; console.warn = () => {}; console.error = () => {}; console.info = () => {};
}

let logPrinted = false;

export function log(...args: any[]) {
	consoleLog(...args);
	logPrinted = true;
}

log.ok = colors.green("OK");
log.warn = colors.yellow("WARN");
log.error = colors.red("ERR");

log.flush = (delimiter = "") => {
	if (logPrinted) {
		consoleLog(delimiter);
	}

	logPrinted = false;
};
