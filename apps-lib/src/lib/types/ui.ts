import type { ThemeLayer } from "@radroots/theme";
import type { GeometryGlyphDimension, ICbOpt, GlyphKey, GlyphWeight } from "./client";

export type IGlyph = ICbOpt & {
    layer?: ThemeLayer;
    classes?: string;
    weight?: GlyphWeight;
    key: GlyphKey;
    dim?: GeometryGlyphDimension;
};
