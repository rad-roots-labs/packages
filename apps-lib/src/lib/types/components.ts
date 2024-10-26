import type { CallbackPromise, CallbackPromiseGeneric, GlyphKey, GlyphWeight, ICb, ICbG, ICbGOpt, ICbOpt, IClOpt, IClWrapOpt, IGl, IGlOpt, IGlyph, IIdOpt, IIdWrapOpt, IInputElement, ILabel, ILabelFieldsOpt, ILabelOpt, ILabelOptFieldsOpt, ILabelValue, ILoadingOpt, ILyOpt, ILyOptTs, ITextAreaElement, NavigationParamTuple, NavigationRoute } from "$lib";

export type ITabsBasisList = IClOpt & {
    icon: GlyphKey;
    active_weight?: GlyphWeight;
    force_weight?: GlyphWeight
    indicator?: string;
    hide_active?: boolean;
    callback: CallbackPromiseGeneric<number>;
    label?: string;
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

export type IEntryStyle = `guide` | `form_line`;
export type IEntryWrap = IClOpt & IIdOpt & ILyOptTs & {
    style?: IEntryStyle;
    style_a?: true;
}

export type IEntryLine = ILoadingOpt & {
    wrap?: IEntryWrap;
    el: IInputElement;
    notify_inline?: {
        glyph: GlyphKey | IGlyph;
    };
};



export type IEntryMultiLine = IIdWrapOpt & IClWrapOpt & {
    el: ITextAreaElement;
    notify_inline?: {
        glyph: GlyphKey | IGlyph;
    };
}

export type IEntrySelectOption = {
    value: string;
    label?: string;
    disabled?: boolean;
    selected?: boolean;
};

export type IEntrySelect = ILoadingOpt & {
    wrap: IEntryWrap;
    el: IIdOpt & IClOpt & ICbGOpt<string> & {
        label?: string;
        hidden?: boolean;
        hide_arrows?: boolean;
        sync?: boolean;
        options: IEntrySelectOption[];
    }
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
        kind?: 'arrow'
    };
    title?: ICbOpt & ILabel;
    option?: INavBasisOption;
};


export type IDisplayLine = IIdWrapOpt & IClOpt & ILabelValue & ILyOpt & {
    style?: IEntryStyle
}