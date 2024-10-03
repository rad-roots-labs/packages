import type { CallbackPromiseGeneric, GeometryCardinalDirection, GeometryDimension, GeometryGlyphDimension, ICbGOpt, ICbOpt, IClOpt, IFormField, ILy, ILyOptTs } from "$lib";
import type { ThemeLayer } from "@radroots/theme";

export type GlyphKeyCurrency = `dollar` | `eur`;

export type GlyphKey = |
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

export type IGlyph = ICbOpt & {
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

export type ILoadingBlades = 6 | 12;

export type ILoadingDimension = GeometryDimension | `glyph-send-button`;

export type ILoading = {
    classes?: string;
    color?: 'white';
    blades?: ILoadingBlades;
    dim?: ILoadingDimension;
};

export type ISelectOption<T extends string> = {
    value: T;
    label: string;
    disabled?: boolean;
};

export type ISelectElement = ILy &
    ICbGOpt<ISelectOption<string>> & {
        id?: string;
        classes?: string;
        mask?: boolean;
        options: { group?: string | true; entries: ISelectOption<string>[] }[];
    };

export type IInputElement = IClOpt & ILyOptTs & {
    id: string;
    placeholder?: string;
    label?: string;
    hidden?: boolean;
    validate?: RegExp;
    sync?: true;
    sync_init?: true | string;
    field?: IFormField;
    /*notify_inline?: {
        glyph: GlyphKey | IGlyph;
    };*/
    callback?: CallbackPromiseGeneric<{ val: string; pass: boolean; }>;
    callback_keydown?: CallbackPromiseGeneric<{ key: string; }>;
    on_mount?: CallbackPromiseGeneric<HTMLInputElement>;
};