//%types%
export type NavigationRoute = string;
//%types%

export type INavigationRoutePreventRouteNav = {
    prevent_route?: {
        callback: CallbackPromise;
    };
}

export type INavigationRoutePreventRoute = {
    prevent_route: CallbackPromise;
}
export type INavigationRoute = {
    route: NavigationRoute | [NavigationRoute, NavigationParamTuple[]];
};

export type GlyphKey = |
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

export type AppConfigType = `farmer` | `personal`
export type AppLayoutKey = 'mobile_base' | 'mobile_y';

export type CallbackPromiseFull<Ti, Tr> = (value: Ti) => Promise<Tr>;
export type CallbackPromiseGeneric<T> = (value: T) => Promise<void>;
export type CallbackPromiseReturn<T> = () => Promise<T>;
export type CallbackPromise = () => Promise<void>;

export type ElementCallbackValue = CallbackPromiseGeneric<{ value: string; pass: boolean; }>;
export type ElementCallbackValueKeydown<T extends HTMLElement> = CallbackPromiseGeneric<{ key: string; key_s: boolean; el: T }>;
export type ElementCallbackValueBlur<T extends HTMLElement> = CallbackPromiseGeneric<{ el: T }>;
export type ElementCallbackValueFocus<T extends HTMLElement> = CallbackPromiseGeneric<{ el: T }>;
export type ElementCallbackMount<T extends HTMLElement> = CallbackPromiseGeneric<{ el: T }>;

export type EntryStyle = `guide` | `line`;

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

export type GlyphWeight = `light` | `regular` | `fill` | `bold`;  // `thin` `duotone`

export type LoadingBlades = 8 | 12;
export type LoadingDimension = GeometryDimension | `glyph-send-button`; //@todo remove

export type LayerGlyphBasisKind = `_a` | `_d` | `_pl`;

export type NavigationRouteParamNostrPublicKey = `nostr_pk`;
export type NavigationRouteParamRecordKey = `rkey`;
export type NavigationRouteParamId = `id`;
export type NavigationRouteParamLat = `lat`;
export type NavigationRouteParamLng = `lng`;
export type NavigationRouteParamKey = NavigationRouteParamNostrPublicKey | NavigationRouteParamId | NavigationRouteParamRecordKey | NavigationRouteParamLat | NavigationRouteParamLng;
export type NavigationParamTuple = [NavigationRouteParamKey, string];
export type NavigationPreviousParam<T extends string> = { route: T, label?: string; params?: NavigationParamTuple[] }

export type CallbackRoute = CallbackPromise | INavigationRoute;