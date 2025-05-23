import type { INavigationRoute, ISelectOption } from "$root";
import type { CallbackPromise, CallbackPromiseFull, CallbackPromiseGeneric, CallbackPromiseResult, GeocoderReverseResult, GeolocationPoint, IClientGeolocationPosition, MediaImageUploadResult, NavigationParamTuple } from "@radroots/util";

export type CallbackRoute<T extends string> = CallbackPromise | INavigationRoute<T>;

export type NavigationRouteParamId = `id`;
export type NavigationRouteParamField = `field`;
export type NavigationRouteParamRef = `ref`;
export type NavigationRouteParamLat = `lat`;
export type NavigationRouteParamLng = `lng`;
export type NavigationRouteParamNostrPublicKey = `key_nostr`;
export type NavigationRouteParamKey = NavigationRouteParamId | NavigationRouteParamField | NavigationRouteParamRef | NavigationRouteParamLat | NavigationRouteParamLng | NavigationRouteParamNostrPublicKey;
export type NavigationRouteParamTuple = NavigationParamTuple<NavigationRouteParamKey>;
export type NavigationPreviousParam<T extends string> = { route: T, label?: string; params?: NavigationRouteParamTuple[] }

export type LocalCallbackColorMode = CallbackPromiseGeneric<ISelectOption<string>>
export type LocalCallbackGuiAlert = CallbackPromiseFull<string, boolean>;
export type LocalCallbackGuiConfirm = CallbackPromiseFull<string | { message: string; ok?: string; cancel?: string }, boolean>;
export type LocalCallbackGeocode = CallbackPromiseFull<GeolocationPoint, GeocoderReverseResult | undefined>;
export type LocalCallbackGeocodeCurrent = CallbackPromiseResult<IClientGeolocationPosition>;
export type LocalCallbackImgBin = CallbackPromiseFull<string, Uint8Array | undefined>;
export type LocalCallbackPhotosAdd = CallbackPromiseResult<string>;
export type LocalCallbackPhotosAddMultiple = CallbackPromiseResult<string[]>;
export type LocalCallbackPhotosUpload = CallbackPromiseFull<{ url: string, path: string }, MediaImageUploadResult | undefined>;

export type MaplibreMap = maplibregl.Map;