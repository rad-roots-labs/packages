import type { ThemeMode } from "../core/types.js";

export type HslTuple = [number, number, number];

export type ThemeSurfaceKey =
    | "_"
    | "_w"
    | "_a"
    | "edge"
    | "blur"
    | "err"
    | "focus";

export type ThemeGlyphKey =
    | "_"
    | "_a"
    | "_pl"
    | "_d"
    | "hl"
    | "hl_a"
    | "shade"
    | "label";

export interface ThemeLayer0 {
    surfaces: {
        _: HslTuple;
        _w: HslTuple;
        _a: HslTuple;
        edge: HslTuple;
        blur: HslTuple;
    };
    glyphs: {
        _: HslTuple;
        _a: HslTuple;
        _pl: HslTuple;
        hl: HslTuple;
        hl_a: HslTuple;
        shade: HslTuple;
        label: HslTuple;
    };
}

export interface ThemeLayer1 {
    surfaces: {
        _: HslTuple;
        _a: HslTuple;
        edge: HslTuple;
        err: HslTuple;
        focus: HslTuple;
    };
    glyphs: {
        _: HslTuple;
        _a: HslTuple;
        _d: HslTuple;
        _pl: HslTuple;
        hl: HslTuple;
        hl_a: HslTuple;
        shade: HslTuple;
        label: HslTuple;
    };
}

export interface ThemeLayer2 {
    surfaces: {
        _: HslTuple;
        _a: HslTuple;
        edge: HslTuple;
    };
    glyphs: {
        _: HslTuple;
        _a: HslTuple;
        _d: HslTuple;
        _pl: HslTuple;
        hl: HslTuple;
        hl_a: HslTuple;
        shade: HslTuple;
    };
}

export interface OsThemePreset {
    ly0: ThemeLayer0;
    ly1: ThemeLayer1;
    ly2: ThemeLayer2;
}

export type ThemePreset = Record<ThemeMode, OsThemePreset>;
