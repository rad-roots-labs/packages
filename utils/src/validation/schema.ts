import { z } from "zod";
import { parse_int } from "../numbers/index.js";
import { util_rxp } from "./regex.js";

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
