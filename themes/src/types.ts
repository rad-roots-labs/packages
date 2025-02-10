import type { ThemeLayer0, ThemeLayer1, ThemeLayer2 } from "./colors";
import { themes } from "./theme";

export type ColorMode = `light` | `dark`;
export type ColorKey<T extends ThemeKey> = `${T}_${ColorMode}`;
export type ColorKeyLight<T extends ThemeKey> = `${T}_light`;
export type ColorKeyDark<T extends ThemeKey> = `${T}_dark`;

export type HslTuple = [number, number, number];

export type Theme = keyof typeof themes;
export type ThemeKey = `os` | `garden`;
export type ThemeLayer = 0 | 1 | 2;
export type ThemeRecord = { layers: ThemeLayers } & { daisy: ThemeDaisy };
export type ThemeLayers = {
    layer_0: ThemeLayer0;
    layer_1: ThemeLayer1;
    layer_2: ThemeLayer2;
};
export type ThemeDaisy = {
    primary: HslTuple | string;
    "primary-focus": HslTuple | string;
    "primary-content": HslTuple | string;
    secondary: HslTuple | string;
    "secondary-focus": HslTuple | string;
    "secondary-content": HslTuple | string;
    accent: HslTuple | string;
    "accent-focus": HslTuple | string;
    "accent-content": HslTuple | string;
    neutral: HslTuple | string;
    "neutral-focus": HslTuple | string;
    "neutral-content": HslTuple | string;
    "base-100": HslTuple | string;
    "base-200": HslTuple | string;
    "base-300": HslTuple | string;
    "base-content": HslTuple | string;
    info: HslTuple | string;
    "info-content": HslTuple | string;
    success: HslTuple | string;
    "success-content": HslTuple | string;
    warning: HslTuple | string;
    "warning-content": HslTuple | string;
    error: HslTuple | string;
    "error-content": HslTuple | string;
    "--rounded-box": HslTuple | string;
    "--rounded-btn": HslTuple | string;
    "--rounded-badge": HslTuple | string;
    "--animation-btn": HslTuple | string;
    "--animation-input": HslTuple | string;
    "--btn-text-case": HslTuple | string;
    "--btn-focus-scale": HslTuple | string;
    "--border-btn": HslTuple | string;
    "--tab-border": HslTuple | string;
    "--tab-radius": HslTuple | string;
    "--spinner-color-base": HslTuple | string;
    "--spinner-color-white": HslTuple | string;
};