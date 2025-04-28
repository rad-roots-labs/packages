import type { IViewFarmsAddSubmission } from "$lib/types/view/farm";
import { form_fields, schema_geocode_result, schema_geolocation_point, zf_numf_pos } from "@radroots/util";
import { z } from "zod";

export const schema_view_farms_add_submission: z.ZodSchema<IViewFarmsAddSubmission> = z.object({
    farm_name: z.string().regex(form_fields.farm_name.validate),
    farm_area: zf_numf_pos.optional(),
    farm_area_unit: z.string().regex(form_fields.area_unit.validate).optional(),
    farm_contact_name: z.string().regex(form_fields.contact_name.validate).optional(),
    geolocation_point: schema_geolocation_point,
    geocode_result: schema_geocode_result,
});