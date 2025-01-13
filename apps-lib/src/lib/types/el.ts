import type { CallbackPromiseGeneric, ElementCallbackMount, ElementCallbackValue, ElementCallbackValueBlur, ElementCallbackValueKeydown, FormField, GeometryGlyphDimension, GeometryScreenPosition, GlyphKey, GlyphWeight, ICbGOpt, ICbOpt, IClOpt, IDisabledOpt, IGlOpt, IId, IIdGOpt, IIdOpt, ILabel, ILyOpt } from "$lib";

export type IToastKind = `simple`;

export type IToast = IClOpt &
    ILabel & IGlOpt & ILyOpt & {
        styles?: IToastKind[];
        position?: GeometryScreenPosition;
    };

export type IGlyph = ICbOpt & IIdOpt & ILyOpt & IClOpt & {
    weight?: GlyphWeight;
    key: GlyphKey;
    dim?: GeometryGlyphDimension;
};

export type IInput<T extends string> = IIdGOpt<T> & IClOpt & ILyOpt & {
    placeholder?: string;
    label?: string;
    hidden?: boolean;
    validate?: RegExp;
    sync?: boolean;
    field?: FormField;
    callback?: ElementCallbackValue,
    callback_keydown?: ElementCallbackValueKeydown<HTMLInputElement>,
    callback_blur?: ElementCallbackValueBlur<HTMLInputElement>;
    callback_focus?: ElementCallbackValueBlur<HTMLInputElement>;
    callback_mount?: ElementCallbackMount<HTMLInputElement>;
};

export type ISelectOption<T extends string> = IDisabledOpt & {
    value: T;
    label: string;
};

export type ISelect = IIdOpt & IClOpt & ILyOpt &
    ICbGOpt<ISelectOption<string>> & {
        sync?: boolean;
        sync_init?: boolean;
        options: { group?: string | true; entries: ISelectOption<string>[] }[];
        show_arrows?: 'l' | 'r';
    };

export type ITextAreaElement = IId & IClOpt & ILyOpt & {
    placeholder?: string;
    label?: string;
    hidden?: boolean;
    validate?: RegExp;
    sync?: true;
    field?: FormField;
    callback?: CallbackPromiseGeneric<{ value: string; pass: boolean; }>;
    callback_keydown?: CallbackPromiseGeneric<{ key: string; key_s: boolean; el: HTMLTextAreaElement }>;
    callback_blur?: CallbackPromiseGeneric<{ el: HTMLTextAreaElement }>;
    callback_focus?: CallbackPromiseGeneric<{ el: HTMLTextAreaElement }>;
    on_mount?: CallbackPromiseGeneric<HTMLTextAreaElement>;
};