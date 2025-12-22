import type { GlyphKey, ICbGOpt, ICbOpt, IClOpt, IGl, IGlOpt, IGlyph, IInput, ILabel, ILabelOpt, ILabelTup, ILoadingOpt, ILy, ISelect } from "@radroots/apps-lib";
import type { CallbackPromise } from "@radroots/utils";
import type { IButtonGlyphCircle } from "./lib";

export type ITrellisExtList = {
    list: (ITrellisKind | undefined)[];
}

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

export type ITrellisStyles = {
    hide_rounded?: boolean;
    hide_border_top?: boolean;
    hide_border_bottom?: boolean;
    set_title_background?: boolean;
    set_default_background?: boolean;
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

export type ITrellisBasisOffsetModKey = 'sm' | 'glyph';
export type ITrellisBasisOffsetMod = ITrellisBasisOffsetModKey | (({ glyph: IGlyph } | { glyph_circle: IButtonGlyphCircle }) & {
    loading?: boolean;
});

export type ITrellisDefault = {
    labels?: ITrellisDefaultLabel[];
    show_title?: boolean;
};

export type ITrellisDefaultLabel = ICbOpt & {
    label: string;
    classes?: string;
};

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
export type ITrellisKindDisplayValue = ICbGOpt<MouseEvent> & ILoadingOpt &
    (ITrellisKindDisplayValueIcon | ILabel);


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
    basis: IInput<string>;
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

export type ITrellisBasisSelect = ICbGOpt<MouseEvent> &
    ILabelTup & ITrellisKindDisplay & ILoadingOpt & {
        end?: ITrellisBasisTouchEnd;
        el: ISelect & { value: string; };
    };

export type ITrellisBasisTouchEnd = ICbGOpt<MouseEvent> & IGl;