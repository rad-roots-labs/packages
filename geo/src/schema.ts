import { z } from "zod";
import { util_rxp } from "@radroots/utils";
import type {
    GeocoderReverseResult,
    GeolocationAddress,
    GeolocationPoint,
} from "./types.js";

export const schema_geolocation_address: z.ZodSchema<GeolocationAddress> = z.object({
    primary: z.string().regex(util_rxp.addr_primary),
    admin: z.string().regex(util_rxp.addr_admin),
    country: z.string().regex(util_rxp.country_code_a2)
});

export const schema_geocode_result: z.ZodSchema<GeocoderReverseResult> = z.object({
    id: z.number(),
    name: z.string(),
    admin1_id: z.union([z.string(), z.number()]),
    admin1_name: z.string(),
    country_id: z.string(),
    country_name: z.string(),
    latitude: z.number(),
    longitude: z.number(),
});

export const schema_geolocation_point: z.ZodSchema<GeolocationPoint> = z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
});
