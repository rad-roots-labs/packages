import type { CallbackPromise, ICbGOpt, ICbOpt, ICbROpt, IClOpt, IGlOpt, ILabel, ILabelOpt, ILabelTup, ILy } from "./client";
import type { GlyphKey, IGlyph, IInputElement } from "./ui";

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
export type ITrellisBasisOffsetMod = ITrellisBasisOffsetModKey | (IGlyph & {
    loading?: boolean;
});

export type ITrellisKind = (
    | ITrellisKindTouch
    | ITrellisKindInput
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
    ILabelTup & {
        end?: ITrellisBasisTouchEnd;
        display?: ITrellisKindDisplayValue;
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