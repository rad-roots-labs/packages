import type { GeocoderReverseResult, GeolocationPoint, IClientGeolocationPosition } from "@radroots/geo";
import type { CallbackPromise, CallbackPromiseFull, CallbackPromiseGeneric, CallbackPromiseResult, MediaImageUploadResult } from "@radroots/utils";
import type { Writable } from "svelte/store";
import type { ISelectOption } from "./components";

export type StoreWritable<S> = S extends Writable<infer T> ? T : never;

export type INavigationRoute<T extends string> = {
    route: T | [T, NavigationParamTuple<NavigationRouteParamKey>[]];
};
export type CallbackRoute<T extends string> = CallbackPromise | INavigationRoute<T>;

export type IViewOnMount<TypeCallbackParam> = {
    on_mount: CallbackPromiseGeneric<TypeCallbackParam>;
};

export type IViewOnDestroy<TypeCallbackParam> = {
    on_destroy: CallbackPromiseGeneric<TypeCallbackParam>;
};


export type IconWeight = `regular` | `bold` | `fill`;

export type GlyphKey = |
    `video-camera` |
    `device-mobile-camera` |
    `crop` |
    `map-trifold` |
    `trash-simple` |
    `backspace` |
    `user-circle-check` |
    `images-square` |
    `bell` |
    `columns` |
    `bold` |
    `article` |
    `grid-four` |
    `link-simple` |
    `seal-check` |
    `selection-foreground` |
    `image-square` |
    `image-broken` |
    `funnel` |
    `users-three` |
    `note-blank` |
    `user-circle-plus` |
    `user-circle` |
    `receipt` |
    `invoice` |
    `note` |
    `arrow-left` |
    `arrows-down-up` |
    `basket` |
    `arrow-right` |
    `upload-simple` |
    `printer` |
    `download-simple` |
    `list` |
    `asterisk` |
    `asterisk-simple` |
    `subtitles-slash` |
    `cardholder` |
    `globe-x` |
    `exclamation-mark` |
    `network-x` |
    `x-circle` |
    `address-book-tabs` |
    `paper-plane-tilt` |
    `note-pencil` |
    `share-fat` |
    `folder` |
    `trash` |
    `plus-circle` |
    `currency-${GlyphKeyCurrency}` |
    `arrow-down` |
    `caret-circle-down` |
    `caret-circle-up` |
    `shopping-bag-open` |
    `coffee-bean` |
    `compass` |
    `map-pin-simple` |
    `handbag-simple` |
    `devices` |
    `lock-key` |
    `gear` |
    `gear-fine` |
    `bell-simple` |
    `envelope` |
    `house-line` |
    `arrows-left-right` |
    `list-plus` |
    `squares-four` |
    `list-plus` |
    `app-window` |
    `circle-notch` |
    `subtract-square` |
    `device-tablet-speaker` |
    `weather-cloud` |
    `warning` |
    `circle-notch` |
    `minus` |
    `key` |
    `arrow-u-up-left` |
    `arrow-counter-clockwise` |
    `circle` |
    `check-circle` |
    `circle-dashed` |
    `dots-three` |
    `cards-three` |
    `lightning` |
    `cards` |
    `note-pencil` |
    `tray` |
    `calendar-dots` |
    `notepad` |
    `network` |
    `calendar-blank` |
    `chats-circle` |
    `plant` |
    `farm` |
    `magnifying-glass` |
    `chat-circle-dots` |
    `dots-three-outline` |
    `copy` |
    `circles-four` |
    `waveform` |
    `film-strip` |
    `arrow-up` |
    `arrow-circle-up` |
    `plus` |
    `funnel-simple` |
    `user` |
    `camera` |
    `check` |
    `file` |
    `share-network` |
    `question` |
    `minus-circle` |
    `globe-simple` |
    `globe` |
    `warning-circle` |
    `x` |
    `info` |
    `caret-${GeometryCardinalDirection}` |
    `caret-up-down`;

export type GlyphKeyCurrency = `dollar` | `eur`;
export type GlyphWeight = `bold` | `fill`

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

export type LayerGlyphBasisKind = `_a` | `_d` | `_pl`;

export type LoadingBlades = 8 | 12;
export type LoadingDimension = GeometryDimension | `glyph-send-button`; // @todo remove

export type ElementCallbackValue = CallbackPromiseGeneric<{ value: string; pass: boolean; }>;
export type ElementCallbackValueKeydown<T extends HTMLElement> = CallbackPromiseGeneric<{ key: string; key_s: boolean; el: T }>;
export type ElementCallbackValueBlur<T extends HTMLElement> = CallbackPromiseGeneric<{ el: T }>;
export type ElementCallbackValueFocus<T extends HTMLElement> = CallbackPromiseGeneric<{ el: T }>;
export type ElementCallbackMount<T extends HTMLElement> = CallbackPromiseGeneric<{ el: T }>;

export type NavigationParamTuple<T extends string> = [T, string];

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
