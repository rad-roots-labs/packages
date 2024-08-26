import type { GlyphKey, ICbGOpt, ICbOpt, ICbROpt, IClOpt, IGlyphOpt, ILabel, ILabelTup, ILy } from "./client";
import type { IGlyph } from "./ui";

export type ITrellis = ILy &
    IClOpt &
    ITrellisStyles & {
        id?: string;
        view?: string;
        title?: ITrellisTitle;
        description?: ITrellisDescription;
        default_el?: ITrellisDefault;
        list?: ITrellisKind[];
    };

export type ITrellisTitle = ICbOpt &
    IClOpt & {
        mod?: ITrellisBasisOffsetMod,
        value: string | true;
        link?: ICbOpt &
        IClOpt &
        IGlyphOpt & {
            icon?: IGlyph;
        };
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

export type ITrellisBasisOffsetModKey = 'none' | 'sm' | 'glyph';
export type ITrellisBasisOffsetMod = ITrellisBasisOffsetModKey | IGlyph;

export type ITrellisKind = (
    | ITrellisKindTouch
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
