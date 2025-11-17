import type { ElementCallbackMount, ElementCallbackValue, ElementCallbackValueBlur, ElementCallbackValueKeydown, GeometryGlyphDimension, GlyphKey, GlyphWeight, ICbOpt, IClOpt, IconWeight, IDisabledOpt, IIdGOpt, IIdOpt, ILyOpt } from "$lib";
import type { CallbackPromiseGeneric, FormField } from "@radroots/utils";
import type { HTMLInputTypeAttribute } from "svelte/elements";


export type EntryStyle = `guide` | `line`;

export type IGlyphI = {
    classes?: string;
    key: string;
    weight?: IconWeight;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
};

export type IGlyph = ICbOpt & IIdOpt & ILyOpt & IClOpt & {
    weight?: GlyphWeight;
    key: GlyphKey;
    dim?: GeometryGlyphDimension;
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
    callback_keydown?: CallbackPromiseGeneric<ILibInputKeydown>;
    callback_input?: CallbackPromiseGeneric<HTMLInputElement>;
};

export type IInput<T extends string> = IIdGOpt<T> & IClOpt & ILyOpt & IDisabledOpt & {
    placeholder?: string;
    label?: string;
    hidden?: boolean;
    validate?: RegExp;
    sync?: boolean;
    field?: FormField;
    field_constrain?: boolean;
    callback?: ElementCallbackValue,
    callback_keydown?: ElementCallbackValueKeydown<HTMLInputElement>,
    callback_blur?: ElementCallbackValueBlur<HTMLInputElement>;
    callback_focus?: ElementCallbackValueBlur<HTMLInputElement>;
    callback_mount?: ElementCallbackMount<HTMLInputElement>;
};

export type IInputValue<T extends string> = Omit<IInput<T>, `sync`>;

export type ISelectOption<T extends string> = IDisabledOpt & {
    value: T;
    label: string;
};

export type ISelectCallback = CallbackPromiseGeneric<ISelectOption<string>>

export type ISelect = IIdOpt & IClOpt & ILyOpt & {
    callback?: ISelectCallback;
    sync?: boolean;
    sync_init?: boolean;
    options: { group?: string | true; entries: ISelectOption<string>[] }[];
    show_arrows?: 'l' | 'r';
};

export type ITextArea = IIdOpt & IClOpt & ILyOpt & {
    placeholder?: string;
    label?: string;
    hidden?: boolean;
    validate?: RegExp;
    sync?: true;
    field?: FormField;
    field_constrain?: boolean;
    callback?: ElementCallbackValue,
    callback_keydown?: ElementCallbackValueKeydown<HTMLTextAreaElement>,
    callback_blur?: ElementCallbackValueBlur<HTMLTextAreaElement>;
    callback_focus?: ElementCallbackValueBlur<HTMLTextAreaElement>;
    callback_mount?: ElementCallbackMount<HTMLTextAreaElement>;
};