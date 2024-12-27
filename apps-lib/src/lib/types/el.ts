import type { ElementCallbackMount, ElementCallbackValue, ElementCallbackValueBlur, ElementCallbackValueKeydown, FormField, GeometryGlyphDimension, GeometryScreenPosition, GlyphKey, GlyphWeight, ICbOpt, IClOpt, IGlOpt, IIdGOpt, IIdOpt, ILabel, ILyOpt } from "$lib";

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


export type IInputElement<T extends string> = IIdGOpt<T> & IClOpt & ILyOpt & {
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