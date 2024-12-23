import { atom } from "recoil";
import { subject } from "../interface";

export const subjectsAtom = atom<Record<string, subject>>({
    key: "subjectsAtom",
    default: {},
});