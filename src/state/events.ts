import { atom } from "recoil";
import { getEvents } from "../services/eventsService";

/**
 * @type {import("recoil").RecoilState<import("../type/events").events>}
 */
export const eventsState = atom({
  key: "events",
  default: (async () => {
    return getEvents(10, 0);
  })(),
});
