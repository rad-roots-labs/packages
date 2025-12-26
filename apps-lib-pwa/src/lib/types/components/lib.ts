import type { CallbackRoute, CarouselStore, GeometryScreenPositionHorizontal, ICb, ICbOpt, IClOpt, IDisabledOpt, IGlyph, IGlyphKey, ILoadingOpt, ILyOpt, LoadingDimension } from "@radroots/apps-lib";
import type { CallbackPromise, CallbackPromiseGeneric } from "@radroots/utils";

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

export type IButtonGlyphCircle = {
    classes_wrap: string;
    glyph: IGlyph
};

export type IButtonNavRound = ICb & IDisabledOpt & ILoadingOpt & IGlyphKey;

export type CarouselMouseEvent = MouseEvent & {
    currentTarget: EventTarget & HTMLDivElement;
};

export type CarouselKeyboardEvent = KeyboardEvent & {
    currentTarget: EventTarget & HTMLDivElement;
};

export type ICarouselContainer<T extends string> = IClOpt & {
    carousel: CarouselStore<T>;
    view?: T;
};

export type ICarouselItem<T extends string> = IClOpt & {
    carousel?: CarouselStore<T>;
    view?: T;
    role?: string;
    tabindex?: number;
    callback_click?: CallbackPromiseGeneric<CarouselMouseEvent>;
    callback_keydown?: CallbackPromiseGeneric<CarouselKeyboardEvent>;
};

export type ILoadCircle = IClOpt & {
    dim?: LoadingDimension;
};

export type IFloatPage = {
    posx: Omit<GeometryScreenPositionHorizontal, "center">;
};
