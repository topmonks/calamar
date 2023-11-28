import fs from "fs";

export function editJsonFile(filepath: string, editFn: (data: any) => any) {
	let json = JSON.parse(fs.readFileSync(filepath, "utf-8"));

	json = editFn(json);

	fs.writeFileSync(filepath, JSON.stringify(json, null, 2));
}
