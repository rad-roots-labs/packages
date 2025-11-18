import { err_msg } from "@radroots/utils";
import type { IClientGeolocation } from "./types.js";

export class WebGeolocation implements IClientGeolocation {
    public async current() {
        try {
            if (!navigator.geolocation) return err_msg("error.client.geolocation.location_unavailable");

            const position = await new Promise<GeolocationPosition>((resolve, reject) =>
                navigator.geolocation.getCurrentPosition(resolve, reject)
            );

            return {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy
            };
        } catch (e) {
            return err_msg("*");
        }
    };
}
