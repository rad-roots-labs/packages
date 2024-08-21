import type { ColorKeyDark, ColorKeyLight } from "../types";
import { write_daisy, write_layers } from "../utils";
import { record_os_dark as dark } from "./dark";
import { record_os_light as light } from "./light";

type key = `os`;

export const theme_os_light: Record<ColorKeyLight<key>, Record<string, string>> = {
    os_light: {
        ...write_daisy(light.daisy),
        ...write_layers(light.layers)
    }
};

export const theme_os_dark: Record<ColorKeyDark<key>, Record<string, string>> = {
    os_dark: {
        ...write_daisy(dark.daisy),
        ...write_layers(dark.layers)
    }
};
