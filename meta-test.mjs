import fs from "fs";
import { decodeMetadata } from "@subsquid/substrate-metadata";

const meta = JSON.parse(fs.readFileSync("./meta.json", "utf-8"));

console.log(meta[0]);

console.log(decodeMetadata(meta[20].metadata).value.modules[5].storage.items);
