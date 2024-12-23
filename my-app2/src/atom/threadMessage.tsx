import { atom } from "recoil";
import { MessageThread } from "../interface";

export const threadMessagesAtom = atom<Record<string, MessageThread>>({
    key: "threadMessagesAtom",
    default: {},
});