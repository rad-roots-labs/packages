import type { GeocoderReverseResult, GeolocationPoint, GeometryDimension, IClientGeolocationPosition, INavigationRoute, ISelectOption } from "$root";

export type ThemeLayer = 0 | 1 | 2;

export type AppConfigType = `farmer` | `personal`

export type AppLayoutKeyIOS = `ios0` | `ios1`;
export type AppLayoutKeyWeb = `web_mobile` | `web_desktop`;
export type AppLayoutKeyWebPwa = `web_ios0` | `web_ios1` | `web0`;

export type AppLayoutKey = AppLayoutKeyIOS | AppLayoutKeyWeb | AppLayoutKeyWebPwa;

export type AppLayoutIOS<T extends string> = `${T}_${AppLayoutKeyIOS}`;
export type AppLayoutWeb<T extends string> = `${T}_${AppLayoutKeyWeb}`;
export type AppLayoutWebPwa<T extends string> = `${T}_${AppLayoutKeyWebPwa}`;

export type AppLayoutKeyHeight =
    | `lo_view_main`
    | `lo_bottom_button`
    | `nav_tabs`
    | `nav_page_header`
    | `nav_page_toolbar`;

export type AppLayoutKeyWidth =
    | `lo`
    | `lo_textdesc`;

export type AppHeightsResponsiveIOS = AppLayoutIOS<AppLayoutKeyHeight>;
export type AppHeightsResponsiveWeb = AppLayoutWeb<AppLayoutKeyHeight>;
export type AppHeightsResponsiveWebPwa = AppLayoutWebPwa<AppLayoutKeyHeight>;

export type AppWidthsResponsiveIOS = AppLayoutIOS<AppLayoutKeyWidth>;
export type AppWidthsResponsiveWeb = AppLayoutWeb<AppLayoutKeyWidth>;
export type AppWidthsResponsiveWebPwa = AppLayoutWebPwa<AppLayoutKeyWidth>;

export type CallbackPromiseFigureResult<Ti, Tr> = (value: Ti) => Promise<Tr | undefined>;
export type CallbackPromiseFull<Ti, Tr> = (value: Ti) => Promise<Tr>;
export type CallbackPromiseGeneric<T> = (value: T) => Promise<void>;
export type CallbackPromiseReturn<T> = () => Promise<T>;
export type CallbackPromiseResult<Tr> = () => Promise<Tr | undefined>;

export type CallbackPromise = () => Promise<void>;
export type CallbackRoute<T extends string> = CallbackPromise | INavigationRoute<T>;

export type ElementCallbackSelect = CallbackPromiseGeneric<ISelectOption<string>>

export type EntryStyle = `guide` | `line`;


export type LoadingBlades = 8 | 12;
export type LoadingDimension = GeometryDimension | `glyph-send-button`; //@todo remove

export type LayerGlyphBasisKind = `_a` | `_d` | `_pl`;


export type NavigationRouteParamId = `id`;
export type NavigationRouteParamField = `field`;
export type NavigationRouteParamRef = `ref`;
export type NavigationRouteParamLat = `lat`;
export type NavigationRouteParamLng = `lng`;
export type NavigationRouteParamNostrPublicKey = `key_nostr`;
export type NavigationRouteParamKey = NavigationRouteParamId | NavigationRouteParamField | NavigationRouteParamRef | NavigationRouteParamLat | NavigationRouteParamLng | NavigationRouteParamNostrPublicKey;
export type NavigationParamTuple = [NavigationRouteParamKey, string];
export type NavigationPreviousParam<T extends string> = { route: T, label?: string; params?: NavigationParamTuple[] }

export type EasingFunction = (t: number) => number;

export interface SvelteTransitionConfig {
    delay?: number;
    duration?: number;
    easing?: EasingFunction;
    css?: (t: number, u: number) => string;
    tick?: (t: number, u: number) => void;
}

export type LcGuiAlertCallback = CallbackPromiseFull<string, boolean>;
export type LcGuiConfirmCallback = CallbackPromiseFull<string | { message: string; ok?: string; cancel?: string }, boolean>;
export type LcGeocodeCurrentCallback = CallbackPromiseResult<IClientGeolocationPosition>;
export type LcGeocodeCallback = CallbackPromiseFull<GeolocationPoint, GeocoderReverseResult | undefined>;
export type LcPhotoAddCallback = CallbackPromiseResult<string>;
export type LcPhotoAddMultipleCallback = CallbackPromiseResult<string[]>;

export type ImageAspectRatio = `auto` | `1/1` | `4/3` | `16/9` | `3/4`;