import type { LoadingDimension } from "@radroots/apps-lib";

export const LOADING_STYLE_MAP: Map<LoadingDimension, { dim_1: number; gl_2: number }> = new Map([
    ["glyph-send-button", { dim_1: 20, gl_2: 20 }],
    ["xs", { dim_1: 12, gl_2: 12 }],
    ["sm", { dim_1: 16, gl_2: 16 }],
    ["md", { dim_1: 20, gl_2: 20 }],
    ["lg", { dim_1: 28, gl_2: 28 }],
    ["xl", { dim_1: 36, gl_2: 36 }],
]);
