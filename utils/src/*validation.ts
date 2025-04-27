import { type GeolocationAddress, type GeolocationPoint, parse_int, util_rxp } from "$root";
import { z } from "zod";

export const zf_area_unit = z.union([
    z.literal(`ac`),
    z.literal(`ft2`),
    z.literal(`ha`),
    z.literal(`m2`),
]);

export const zf_mass_unit = z.union([
    z.literal(`kg`),
    z.literal(`lb`),
    z.literal(`g`),
]);

export const schema_geolocation_address: z.ZodSchema<GeolocationAddress> = z.object({
    primary: z.string().regex(util_rxp.addr_primary),
    admin: z.string().regex(util_rxp.addr_admin),
    country: z.string().regex(util_rxp.country_code_a2)
});

export const schema_geolocation_point: z.ZodSchema<GeolocationPoint> = z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
});

export const zf_price_amount = z.preprocess((input) => {
    return parse_int(String(input), 1.00);
}, z.number().positive().multipleOf(0.01));

export const zf_quantity_amount = z.preprocess((input) => {
    return parse_int(String(input), 1);
}, z.number().int().positive());

export const zf_price = z.number().positive().multipleOf(0.01);

export const zf_numi_pos = z.number().int().positive();

export const zf_numf_pos = z.number().positive();

export const zf_email = z.string().email();

export const zf_username = z.string().regex(util_rxp.profile_name);