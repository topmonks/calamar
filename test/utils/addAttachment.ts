import fs from "fs";
import path from "path";

import config from "../../playwright.config";

import { expect, test } from "../test";

/**
 * Add test attachment with fixed path.
 *
 * Attachment is added only once if called multiple times.
 *
 * @param name Attachment name
 * @param relativeFilepath Attachemnt filepath relative to {config.outputDir}
 * @param contentType Content type
 * @returns
 */
export function addAttachment(name: string, relativeFilepath: string, contentType: string, data?: any) {
	const attachment = {
		name,
		contentType,
		path: path.join(config.outputDir!, relativeFilepath),
	};

	const existingAttachment = test.info().attachments.find(it => it.name === name);

	if (!existingAttachment) {
		test.info().attachments.push(attachment);

		if (!fs.existsSync(attachment.path)) {
			fs.mkdirSync(path.dirname(attachment.path), { recursive: true });
			fs.writeFileSync(attachment.path, data || "");
		}
	} else {
		expect(existingAttachment).toEqual(attachment);
	}

	return attachment;
}
