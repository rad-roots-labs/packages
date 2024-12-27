import type { CallbackPromise, EntryStyle, GlyphKey, IGlyph, IInputElement, LayerGlyphBasisKind, LoadingBlades, LoadingDimension } from "$lib";
import type { ThemeLayer } from "@radroots/theme";
import type { TransitionConfig } from "svelte/transition";

export type IDisabledOpt = {
    disabled?: boolean | never;
}

export type IBasis<T> = {
    basis: T;
};

export type ICb = {
    callback: CallbackPromise | never;
};

export type ICbOpt = Partial<ICb>;

export type ICl = {
    classes: string | never;
};

export type IClOpt = Partial<ICl>;


export type IId = {
    id: string | never;
};

export type IIdOpt = Partial<IId>;

export type IGl = {
    glyph: IGlyph | never;
};

export type IGlOpt = Partial<IGl>;

export type ILy = {
    layer: ThemeLayer | never;
};

export type ILyOpt = Partial<ILy>;

export type ILableFieldsSwap = {
    toggle: boolean;
    on: IClOpt & {
        value: string;
    },
    off: IClOpt & {
        value: string;
    },
};

export type ILabelSwap = {
    swap: ILableFieldsSwap;
}

export type ILableFields = & {
    classes_wrap?: string
    classes?: string;
    kind?: LayerGlyphBasisKind;
    hide_truncate?: boolean;
    hide_active?: boolean;
} & (
        ({
            value: string;
        } | ILabelSwap)
        | IGl
    );

export type ILabel = {
    label: ILableFields;
};

export type ILoadSymbol = IClOpt & {
    color?: 'white';
    blades?: LoadingBlades;
    dim?: LoadingDimension;
};

export type IIdG<T extends string> = {
    id: T | never;
};

export type FormField = {
    validate: RegExp;
    charset: RegExp;
    validate_keypress?: boolean;
};

export type IIdGOpt<T extends string> = Partial<IIdG<T>>;


export type IIdWrap = {
    id_wrap: string | never;
};

export type IIdWrapOpt = Partial<IIdWrap>;

export type ILabelValue = {
    label: IClOpt & {
        value: string;
    };
};

export type ILabelDisplay = IIdWrapOpt & IClOpt & ILabelValue & ILyOpt & {
    style?: EntryStyle;
};


export type ILoading = {
    loading: boolean | never;
};

export type ILoadingOpt = Partial<ILoading>;

export type IEntryWrap = IClOpt & IIdOpt & ILyOpt & {
    style?: EntryStyle;
    style_a?: true;
    no_pad?: true;
    fade?: {
        in?: TransitionConfig;
        out?: TransitionConfig;
    };
}

export type IEntryLine = ILoadingOpt & {
    wrap?: IEntryWrap;
    el: IInputElement<string>;
    notify_inline?: {
        glyph: GlyphKey | IGlyph;
    };
};
