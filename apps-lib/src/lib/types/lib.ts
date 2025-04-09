import type { INavigationRoute } from "$root";
import type { CallbackPromise, CallbackPromiseFull, CallbackPromiseResult, GeocoderReverseResult, GeolocationPoint, IClientGeolocationPosition, NavigationParamTuple } from "@radroots/util";

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

export type LcGuiAlertCallback = CallbackPromiseFull<string, boolean>;
export type LcGuiConfirmCallback = CallbackPromiseFull<string | { message: string; ok?: string; cancel?: string }, boolean>;
export type LcGeocodeCurrentCallback = CallbackPromiseResult<IClientGeolocationPosition>;
export type LcGeocodeCallback = CallbackPromiseFull<GeolocationPoint, GeocoderReverseResult | undefined>;
export type LcPhotoAddCallback = CallbackPromiseResult<string>;
export type LcPhotoAddMultipleCallback = CallbackPromiseResult<string[]>;
