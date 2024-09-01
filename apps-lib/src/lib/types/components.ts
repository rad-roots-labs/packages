import type { CallbackPromiseGeneric, IClOpt, ILy } from "./client";
import type { GlyphKey, GlyphWeight } from "./ui";

export type ITabsBasisList = {
    icon: GlyphKey;
    classes?: string;
    active_weight?: GlyphWeight;
    indicator?: string
    callback: CallbackPromiseGeneric<number>;
};

export type ITabsBasis = {
    list: ITabsBasisList[];
    blur?: boolean;
    tab_active: number;
    app_layout: string;
};

export type IFormField = {
    validate: RegExp;
    charset: RegExp;
    validateKeypress?: boolean;
};

export type IInputFormBasis = IClOpt & ILy & {
    id: string;
    placeholder?: string;
    label?: string;
    hidden?: boolean;
    validate?: RegExp;
    sync?: boolean;
    field: IFormField
};

