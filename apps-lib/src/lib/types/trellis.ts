import type { CallbackPromise, GlyphKey, ICbGOpt, ICbOpt, ICbROpt, IClOpt, IGlOpt, IGlyph, IGlyphCircle, IInputElement, ILabel, ILabelOpt, ILabelTup, ILy } from "$lib";

export type ITrellis = ILy &
    IClOpt &
    ITrellisStyles & {
        id?: string;
        view?: string;
        title?: ITrellisTitle;
        description?: ITrellisDescription;
        default_el?: ITrellisDefault;
        list?: (ITrellisKind | undefined)[];
        hide_offset?: true;
    };

export type ITrellisTitle = ICbOpt &
    IClOpt & {
        mod?: ITrellisBasisOffsetMod,
        value: string | true;
        link?: ICbOpt &
        IClOpt &
        IGlOpt & ILabelOpt;
    };

export type ITrellisDescription = string | true;

export type ITrellisDefault = {
    labels?: ITrellisDefaultLabel[];
    show_title?: boolean;
};

export type ITrellisDefaultLabel = ICbROpt & {
    label: string;
    classes?: string;
};

export type ITrellisStyles = {
    hide_rounded?: boolean;
    hide_border_top?: boolean;
    hide_border_bottom?: boolean;
    set_title_background?: boolean;
    set_default_background?: boolean;
};

export type ITrellisBasisOffsetModKey = 'sm' | 'glyph';
export type ITrellisBasisOffsetMod = ITrellisBasisOffsetModKey | (({ glyph: IGlyph } | { glyph_circle: IGlyphCircle }) & {
    loading?: boolean;
});

export type ITrellisKind = (
    | ITrellisKindTouch
    | ITrellisKindInput
    | ITrellisKindSelect

);

export type ITrellisBasis = {
    loading?: boolean;
    hide_active?: boolean;
    hide_field?: boolean;
    offset?: ITrellisBasisOffset;
    full_rounded?: boolean;
};

export type ITrellisBasisOffset = ICbGOpt<MouseEvent> &
    IClOpt & {
        mod?: ITrellisBasisOffsetMod;
        classes?: string;
        hide_space?: boolean;
        hide_offset?: boolean;
    };

export type ITrellisKindDisplay = {
    display?: ITrellisKindDisplayValue;
}
export type ITrellisKindDisplayValue = ICbGOpt<MouseEvent> &
    (ITrellisKindDisplayValueIcon | ILabel);

export type ITrellisBasisTouchEnd = ICbGOpt<MouseEvent> & {
    icon: IGlyph;
};

export type ITrellisKindDisplayValueIcon = {
    icon: {
        classes?: string;
        key: GlyphKey;
    };
};

export type ITrellisKindTouch = ITrellisBasis & {
    touch: ITrellisBasisTouch;
};

export type ITrellisBasisTouch = ICbGOpt<MouseEvent> &
    ILabelTup & ITrellisKindDisplay & {
        end?: ITrellisBasisTouchEnd;
    };

export type ITrellisKindInput = ITrellisBasis & {
    input: ITrellisBasisInput;
};

export type ITrellisBasisInput = {
    basis: IInputElement;
    line_label?: {
        classes?: string;
        value: string;
    };
    action?: {
        visible: boolean;
        loading?: boolean;
        callback?: CallbackPromise;
        glyph?: IGlyph
    };
};

export type ITrellisKindSelect = ITrellisBasis & {
    select: ITrellisBasisSelect;
};

export type ITrellisBasisSelect =
    ILabelTup & ITrellisKindDisplay & {
        end?: ITrellisBasisTouchEnd;
    };
