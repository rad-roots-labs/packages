import type { ThemeLayer } from "@radroots/theme";
import type { IGlyph } from "./ui";

export type AppLayoutKey = 'lg' | 'base';
type NavigationRouteBasis = string;
export type AnchorRoute = `/${string}`;
export type NavigationRouteParamPublicKey = `pk`;
export type NavigationRouteParamId = `id`;
export type NavigationRouteParamCmd = `cmd`;
export type NavigationRouteParamKey = NavigationRouteParamPublicKey | NavigationRouteParamId | NavigationRouteParamCmd;
export type NavigationParamTuple = [NavigationRouteParamKey, string];
export type NavigationPreviousParam = { route: NavigationRouteBasis, label?: string; params?: NavigationParamTuple[] }

export type GeometryScreenPositionHorizontal = `left` | `center` | `right`;
export type GeometryScreenPositionVertical = `top` | `center` | `bottom`;
export type GeometryScreenPosition = `${GeometryScreenPositionVertical}-${GeometryScreenPositionHorizontal}`;
export type GeometryCardinalDirection = `up` | `down` | `left` | `right`;
export type GeometryDimension =
    `xs` |
    `sm` |
    `md` |
    `lg` |
    `xl`;
export type GeometryGlyphDimension =
    | `${GeometryDimension}`
    | `${GeometryDimension}-`
    | `${GeometryDimension}--`
    | `${GeometryDimension}+`;


//export type CallbackPromiseGenericReturn<T1, T2> = (value: T1) => Promise<T2>;
export type CallbackPromiseGeneric<T> = (value: T) => Promise<void>;
//export type CallbackPromiseReturn<T> = () => Promise<T>;
export type CallbackPromise = () => Promise<void>;

export type NavigationRoute = string; //@todo

export type IRoute = {
    route: NavigationRoute;
};

export type IRouteOpt = {
    route?: NavigationRoute;
};

export type ICbGR<T> = ICbG<T> | IRoute

export type ICb = {
    callback: CallbackPromise;
};

export type ICbOpt = {
    callback?: CallbackPromise;
};

export type ICbG<T> = {
    callback: CallbackPromiseGeneric<T>;
};

export type ICbGOpt<T> = {
    callback?: CallbackPromiseGeneric<T>;
};

export type ICbROpt = ICbOpt | IRouteOpt

export type IClOpt = {
    classes?: string;
};

export type ILy = {
    layer: ThemeLayer;
};

export type ILyOpt = {
    layer?: ThemeLayer;
};

export type ILyTs = {
    layer: ThemeLayer | false;
};

export type ILyOptTs = {
    layer?: ThemeLayer | false;
};

export type IGl = {
    glyph: IGlyph;
}

export type IGlOpt = {
    glyph?: IGlyph;
}

export type ILabelFieldsOpt = {
    label: {
        value?: string;
        classes?: string;
    };
};

export type ILabelOptFieldsOpt = {
    label?: {
        value?: string;
        classes?: string;
    };
};

export type IGlyphFields = {
    value: string;
    classes?: string;
};

export type ILabel = {
    label: ILableFields;
};

export type ILabelOpt = {
    label?: ILableFields;
};

export type ILabelTup = {
    label: ILabelTupFields;
};

export type ILabelTupFields = {
    left?: ILableFields[];
    right?: ILableFields[];
};

export type ILableFields = IGlOpt & {
    value: string;
    swap?: string;
    classes?: string
    kind?: LabelFieldKind
    hide_truncate?: boolean;
    hide_active?: boolean;
};

export type LabelFieldKind = `link` | `on` | `shade`;

