import type { NavigationRoute } from "$lib/utils/routes";
import type { CallbackPromise, CallbackPromiseGeneric, ICb, ICbG, ICbGOpt, ICbOpt, IClOpt, IClWrapOpt, IGl, IGlOpt, IIdOpt, IIdWrapOpt, ILabel, ILabelFieldsOpt, ILabelOpt, ILabelOptFieldsOpt, ILoadingOpt, ILyOpt, ILyOptTs, NavigationParamTuple } from "./client";
import type { GlyphKey, GlyphWeight, IGlyph, IInputElement, ITextAreaElement } from "./ui";

export type ITabsBasisList = IClOpt & {
    icon: GlyphKey;
    active_weight?: GlyphWeight;
    force_weight?: GlyphWeight
    indicator?: string;
    hide_active?: boolean;
    callback: CallbackPromiseGeneric<number>;
};

export type ITabsBasis = IClOpt & {
    list?: ITabsBasisList[];
    blur?: boolean;
    hide_active?: boolean;
};

export type IFormField = {
    validate: RegExp;
    charset: RegExp;
    validate_keypress?: boolean;
};

export type IEntryLineStyle = `guide`;
export type IEntryLine = IIdWrapOpt & IClOpt & ILoadingOpt & {
    el: IInputElement;
    style?: IEntryLineStyle
    notify_inline?: {
        glyph: GlyphKey | IGlyph;
    };
}

export type IEntryMultiLine = IIdWrapOpt & IClWrapOpt & {
    el: ITextAreaElement;
    notify_inline?: {
        glyph: GlyphKey | IGlyph;
    };
}

export type IEntryOptionOption = {
    value: string;
    label?: string;
    disabled?: boolean;
    selected?: boolean;
};

export type IEntryOption = IIdOpt & IIdWrapOpt & IClWrapOpt & IClOpt & ILyOptTs & ICbGOpt<string> & {
    label?: string;
    hidden?: boolean;
    hide_arrows?: boolean;
    sync?: boolean;
    loading?: boolean;
    options: IEntryOptionOption[];
};


export type IEnvelopeBasis = ILyOpt &
    IClOpt & IEnvelopeKind & {
        visible: boolean;
        close: CallbackPromise;
        transparent?: boolean;
    };

export type IEnvelopeKind = (
    {
        titled: IEnvelopeTitledBasis;
    });

export type IEnvelopeTitledBasis = {
    hide_border?: boolean;
    previous?: ILabelOptFieldsOpt;
    heading?: ILabelOptFieldsOpt;
    submit?: ICb & (ILabelFieldsOpt | IGl) & {
        valid?: boolean;
    }
};

export type INavBasisOption = IClOpt & ICbG<
    HTMLLabelElement | null
> & IGlOpt & ILabelOpt & {
    loading?: boolean;
};
export type INavBasis = {
    prev: ICbOpt & {
        label?: string;
        route: NavigationRoute | [NavigationRoute, NavigationParamTuple[]];
        prevent_route?: {
            callback: CallbackPromise;
        };
    };
    title?: ICbOpt & ILabel;
    option?: INavBasisOption;
};

