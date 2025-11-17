import type { CallbackRoute, GeometryScreenPositionHorizontal, ICb, ICbOpt, IDisabledOpt, IGlyph, IGlyphKey, ILoadingOpt, ILyOpt } from "@radroots/apps-lib";
import type { CallbackPromise } from "@radroots/utils";

export type IButtonSimple = ILyOpt & {
    label: string;
    callback: CallbackPromise;
    allow_propogation?: boolean;
};

export type IPageHeader<T extends string> = {
    label: string;
    callback_route?: CallbackRoute<T>;
};

export type IPageToolbar<T extends string> = ICbOpt & {
    header?: IPageHeader<T>;
};

export type IMapMarkerArea = {
    show_display?: boolean;
    no_drag?: boolean;
}

export type IGlyphCircle = {
    classes_wrap: string;
    glyph: IGlyph
};

export type IFloatPage = {
    posx: Omit<GeometryScreenPositionHorizontal, "center">;
};

export type IButtonNavRound = ICb & IDisabledOpt & ILoadingOpt & IGlyphKey;
