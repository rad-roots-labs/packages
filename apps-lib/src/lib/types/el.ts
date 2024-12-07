import type { CallbackPromiseGeneric, GeometryCardinalDirection, GeometryDimension, GeometryGlyphDimension, ICbGOpt, ICbOpt, IClOpt, IFormField, IId, IIdOpt, ILyOptTs } from "$lib";
import type { ThemeLayer } from "@radroots/theme";

export type GlyphKeyCurrency = `dollar` | `eur`;

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

export type GlyphWeight = `light` | `regular` | `fill` | `bold`;  // `thin` `duotone`

export type IGlyph = ICbOpt & IIdOpt & {
    layer?: ThemeLayer;
    classes?: string;
    weight?: GlyphWeight;
    key: GlyphKey;
    dim?: GeometryGlyphDimension;
};

export type IGlyphCircle = {
    classes_wrap: string;
    glyph: IGlyph
};

export type ILoadingBlades = 8 | 12;

export type ILoadingDimension = GeometryDimension | `glyph-send-button`;

export type ILoading = {
    classes?: string;
    color?: 'white';
    blades?: ILoadingBlades;
    dim?: ILoadingDimension;
};

export type IDisabledOpt = {
    disabled?: boolean;
}

export type ISelectOption<T extends string> = IDisabledOpt & {
    value: T;
    label: string;
};

export type ISelectElement = IIdOpt & IClOpt & ILyOptTs &
    ICbGOpt<ISelectOption<string>> & {
        sync?: boolean;
        sync_init?: boolean;
        options: { group?: string | true; entries: ISelectOption<string>[] }[];
        show_arrows?: 'l' | 'r';
    };

export type IInputElement = IId & IClOpt & ILyOptTs & {
    placeholder?: string;
    label?: string;
    hidden?: boolean;
    validate?: RegExp;
    sync?: boolean;
    field?: IFormField;
    callback?: CallbackPromiseGeneric<{ value: string; pass: boolean; }>;
    callback_keydown?: CallbackPromiseGeneric<{ key: string; el: HTMLInputElement }>;
    callback_blur?: CallbackPromiseGeneric<{ el: HTMLInputElement }>;
    callback_focus?: CallbackPromiseGeneric<{ el: HTMLInputElement }>;
    on_mount?: CallbackPromiseGeneric<HTMLInputElement>;
};

export type ITextAreaElement = IId & IClOpt & ILyOptTs & {
    placeholder?: string;
    label?: string;
    hidden?: boolean;
    validate?: RegExp;
    sync?: true;
    field?: IFormField;
    callback?: CallbackPromiseGeneric<{ value: string; pass: boolean; }>;
    callback_keydown?: CallbackPromiseGeneric<{ key: string; }>;
    callback_blur?: CallbackPromiseGeneric<{ el: HTMLTextAreaElement }>;
    callback_focus?: CallbackPromiseGeneric<{ el: HTMLTextAreaElement }>;
    on_mount?: CallbackPromiseGeneric<HTMLTextAreaElement>;
};