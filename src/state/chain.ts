import { atom } from "recoil";

/**
 * @type {import("recoil").RecoilState<import("../type/chain").chain>}
 */
export const chainState = atom({
  key: "chain",
  default: undefined,
});
