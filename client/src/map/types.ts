import type { GeolocationCoordinatesPoint } from "@radroots/utils";

export type IClientMap = {
    show_map: (point: GeolocationCoordinatesPoint) => Promise<boolean>;
    set_region: (point: GeolocationCoordinatesPoint) => Promise<boolean>;
};