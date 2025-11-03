import type { Writable } from "svelte/store";

export type ThemeMode = 'light' | 'dark';
export type StoreWritable<S> = S extends Writable<infer T> ? T : never;

export type CallbackPromise = () => Promise<void>
export type CallbackPromiseArgs<T> = (args: T) => Promise<void>
