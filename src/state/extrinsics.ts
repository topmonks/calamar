import { atom } from "recoil";
import { getExtrinsics } from "../services/extrinsicsService";

/**
 * @type {import("recoil").RecoilState<import("../type/extrinsics").extrinsics>}
 */
export const extrinsicsState = atom({
  key: "extrinsics",
  default: (async () => {
    return getExtrinsics(10, 0, { isSigned: true });
  })(),
});
