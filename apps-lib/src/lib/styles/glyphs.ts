import type { GeometryGlyphDimension } from "$lib/types/lib";

export const glyph_style_map: Map<GeometryGlyphDimension, { gl_1: number; dim_1?: number; }> = new Map([
    ["xs--", { gl_1: 12 }],
    ["xs-", { gl_1: 12, dim_1: 17 }],
    ["xs", { gl_1: 15, dim_1: 18 }],
    ["xs+", { gl_1: 18, dim_1: 20 }],
    ["sm-", { gl_1: 19, dim_1: 22 }],
    ["sm", { gl_1: 20, dim_1: 24 }],
    ["sm+", { gl_1: 21 }],
    ["md-", { gl_1: 23 }],
    ["md", { gl_1: 24 }],
    ["md+", { gl_1: 26 }],
    ["lg-", { gl_1: 27 }],
    ["lg", { gl_1: 28 }],
    ["xl", { gl_1: 30 }],
    ["xl+", { gl_1: 40 }],
]);