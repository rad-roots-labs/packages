import type { ColorKeyDark, ColorKeyLight } from "../types";
import { write_daisy, write_layers } from "../utils";
import { record_garden_dark as dark } from "./dark";
import { record_garden_light as light } from "./light";

type key = `garden`;

export const theme_garden_light: Record<ColorKeyLight<key>, Record<string, string>> = {
    garden_light: {
        ...write_daisy(light.daisy),
        ...write_layers(light.layers)
    }
};

export const theme_garden_dark: Record<ColorKeyDark<key>, Record<string, string>> = {
    garden_dark: {
        ...write_daisy(dark.daisy),
        ...write_layers(dark.layers)
    }
};
