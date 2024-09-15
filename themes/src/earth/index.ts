import type { ColorKeyDark, ColorKeyLight } from "../types";
import { write_daisy, write_layers } from "../utils";
import { record_earth_dark as dark } from "./dark";
import { record_earth_light as light } from "./light";

type key = `earth`;

export const theme_earth_light: Record<ColorKeyLight<key>, Record<string, string>> = {
    earth_light: {
        ...write_daisy(light.daisy),
        ...write_layers(light.layers)
    }
};

export const theme_earth_dark: Record<ColorKeyDark<key>, Record<string, string>> = {
    earth_dark: {
        ...write_daisy(dark.daisy),
        ...write_layers(dark.layers)
    }
};
