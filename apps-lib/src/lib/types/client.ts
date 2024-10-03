import { type IGlyph, type NavigationRoute } from "$lib";
import type { ThemeLayer } from "@radroots/theme";

export type AppLayoutKey = 'lg' | 'base';
export type AnchorRoute = `/${string}`;
export type NavigationRouteParamNostrPublicKey = `nostr_pk`;
export type NavigationRouteParamRecordKey = `rkey`;
export type NavigationRouteParamId = `id`;
export type NavigationRouteParamLat = `lat`;
export type NavigationRouteParamLng = `lng`;
export type NavigationRouteParamKey = NavigationRouteParamNostrPublicKey | NavigationRouteParamId | NavigationRouteParamRecordKey | NavigationRouteParamLat | NavigationRouteParamLng;
export type NavigationParamTuple = [NavigationRouteParamKey, string];
export type NavigationPreviousParam = { route: NavigationRoute, label?: string; params?: NavigationParamTuple[] }

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
    kind?: LabelFieldKind
    hide_truncate?: boolean;
    hide_active?: boolean;
} & (
        ({
            value: string;
        } | ILabelSwap)
        | IGl
    );

export type LabelFieldKind = `link` | `on` | `shade`;

export type IToastKind = `simple`;

export type IToast = IClOpt &
    ILabel & IGlOpt & {
        styles?: IToastKind[];
        layer?: ThemeLayer;
        position?: GeometryScreenPosition;
    };

