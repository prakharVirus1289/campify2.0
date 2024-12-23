import { atom } from "recoil";
import { MessageMain } from "../interface";

export const mainMessagesAtom = atom<Record<string, MessageMain>>({
    key: "mainMessagesAtom",
    default: {},
});