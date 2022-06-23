import { atom } from "recoil";
import { getBlocks } from "../services/blocksService";

/**
 * @type {import("recoil").RecoilState<import("../type/blocks").blocks>}
 */
export const blocksState = atom({
  key: "blocks",
  default: (async () => {
    return getBlocks(10, 0, {});
  })(),
});
