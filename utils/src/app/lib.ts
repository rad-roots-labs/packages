import type { CallbackPromise, CallbackPromiseGeneric } from "$root";

export type IViewBasis<T extends object> = {
    kv_init_prevent?: boolean;
    on_mount?: CallbackPromise;
    on_destroy?: CallbackPromise;
} & T;


export type LabelFieldKind = `link` | `on` | `shade`;
export type EntryStyle = `guide` | `line`;
export type ImageAspectRatio = `auto` | `1/1` | `4/3` | `16/9` | `3/4`;

export type SvelteTransitionEasingFunction = (t: number) => number;

export type LoadingBlades = 8 | 12;
export type LoadingDimension = GeometryDimension | `glyph-send-button`; //@todo remove

export type LayerGlyphBasisKind = `_a` | `_d` | `_pl`;

export interface SvelteTransitionConfig {
    delay?: number;
    duration?: number;
    easing?: SvelteTransitionEasingFunction;
    css?: (t: number, u: number) => string;
    tick?: (t: number, u: number) => void;
}

export type ElementCallbackValue = CallbackPromiseGeneric<{ value: string; pass: boolean; }>;
export type ElementCallbackValueKeydown<T extends HTMLElement> = CallbackPromiseGeneric<{ key: string; key_s: boolean; el: T }>;
export type ElementCallbackValueBlur<T extends HTMLElement> = CallbackPromiseGeneric<{ el: T }>;
export type ElementCallbackValueFocus<T extends HTMLElement> = CallbackPromiseGeneric<{ el: T }>;
export type ElementCallbackMount<T extends HTMLElement> = CallbackPromiseGeneric<{ el: T }>;

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

export type NavigationParamTuple<T extends string> = [T, string];
