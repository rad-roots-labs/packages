import type { CallbackPromise, CallbackPromiseGeneric, ICb, IClOpt, IGlyphFields, ILy, ILyOpt } from "./client";
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

export type IEnvelopeBasis = ILyOpt &
    IClOpt & IEnvelopeKind & {
        visible: boolean;
        close: CallbackPromise;
        transparent?: boolean;
    };

export type IEnvelopeKind = {
    titled: IEnvelopeTitledBasis;
};

export type IEnvelopeTitledBasis = ICb & {
    callback_valid?: boolean;
    previous?: string;
    title: IGlyphFields;
    action?: string;
    hide_border?: boolean;
};

