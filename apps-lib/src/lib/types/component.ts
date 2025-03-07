import { type GeometryScreenPositionHorizontal, type ICb, type IDisabledOpt, type IGlyphKey, type ILoadingOpt } from "@radroots/util";

export type IButtonNavRound = ICb & IDisabledOpt & ILoadingOpt & IGlyphKey;

export type IFloatPage = {
    posx: Omit<GeometryScreenPositionHorizontal, "center">;
}