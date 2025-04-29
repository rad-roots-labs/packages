import type { ContextMap } from "$lib/types/context";
import { getContext, setContext } from "svelte";

export const get_context = <K extends keyof ContextMap>(key: K): ContextMap[K] => {
    return getContext(key) as ContextMap[K];
};

export const set_context = <K extends keyof ContextMap>(key: K, value: ContextMap[K]): void => {
    setContext(key, value);
};