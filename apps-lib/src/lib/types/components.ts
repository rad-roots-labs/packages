import type { CallbackPromiseArgs } from "$lib";
import type { HTMLInputTypeAttribute } from "svelte/elements";

export type IconWeight = `regular` | `bold` | `fill`;

export type IGlyphI = {
    classes?: string;
    key: string;
    weight?: IconWeight;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
};

export type ILibInputKeydown = {
    key: string;
    is_submit: boolean;
    el: HTMLInputElement;
};

export type ILibInput = {
    classes?: string;
    type?: HTMLInputTypeAttribute;
    pattern?: string;
    placeholder?: string;
    disabled?: boolean;
    callback_keydown?: CallbackPromiseArgs<ILibInputKeydown>;
    callback_input?: CallbackPromiseArgs<HTMLInputElement>;
};