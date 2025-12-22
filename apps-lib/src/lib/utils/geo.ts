import type { GeolocationPoint } from "@radroots/geo";

export const geop_is_valid = (point?: GeolocationPoint): boolean => {
    if (!point) return false;
    return !(point.lat === 0 && point.lng === 0);
};

export const geop_init = (): GeolocationPoint => ({ lat: 0, lng: 0 });
