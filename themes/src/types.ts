import type { ThemeLayer0, ThemeLayer1, ThemeLayer2 } from "./colors";
import { themes } from "./theme";

export type ColorMode = `light` | `dark`;
export type ColorKey<T extends ThemeKey> = `${T}_${ColorMode}`;
export type ColorKeyLight<T extends ThemeKey> = `${T}_light`;
export type ColorKeyDark<T extends ThemeKey> = `${T}_dark`;

export type HslTuple = [number, number, number];

export type Theme = keyof typeof themes;
export type ThemeKey = `os` | `earth`;
export type ThemeLayer = 0 | 1 | 2;
export type ThemeRecord = { layers: ThemeLayers } & { daisy: ThemeDaisy };
export type ThemeLayers = {
    layer_0: ThemeLayer0;
    layer_1: ThemeLayer1;
    layer_2: ThemeLayer2;
};
export type ThemeDaisy = {
    primary: HslTuple;
    "primary-focus": HslTuple;
    "primary-content": HslTuple;
    secondary: HslTuple;
    "secondary-focus": HslTuple;
    "secondary-content": HslTuple;
    accent: HslTuple;
    "accent-focus": HslTuple;
    "accent-content": HslTuple;
    neutral: HslTuple;
    "neutral-focus": HslTuple;
    "neutral-content": HslTuple;
    "base-100": HslTuple;
    "base-200": HslTuple;
    "base-300": HslTuple;
    "base-content": HslTuple;
    info: HslTuple;
    "info-content": HslTuple;
    success: HslTuple;
    "success-content": HslTuple;
    warning: HslTuple;
    "warning-content": HslTuple;
    error: HslTuple;
    "error-content": HslTuple;
    "--rounded-box": HslTuple;
    "--rounded-btn": HslTuple;
    "--rounded-badge": HslTuple;
    "--animation-btn": HslTuple;
    "--animation-input": HslTuple;
    "--btn-text-case": HslTuple;
    "--btn-focus-scale": HslTuple;
    "--border-btn": HslTuple;
    "--tab-border": HslTuple;
    "--tab-radius": HslTuple;
    "--spinner-color-base": HslTuple;
    "--spinner-color-white": HslTuple;
};