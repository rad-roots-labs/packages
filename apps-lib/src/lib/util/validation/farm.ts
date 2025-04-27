import type { IViewFarmsAddSubmission } from "$lib/types/view/farm";
import { form_fields, schema_geolocation_address, schema_geolocation_point, zf_numf_pos } from "@radroots/util";
import { z } from "zod";

export const schema_view_farms_add_submission: z.ZodSchema<IViewFarmsAddSubmission> = z.object({
    farm_name: z.string().regex(form_fields.farm_name.validate),
    farm_area: zf_numf_pos,
    farm_area_unit: z.string().regex(form_fields.area_unit.validate),
    farm_contact_name: z.string().regex(form_fields.contact_name.validate),
    geolocation_point: schema_geolocation_point,
    geolocation_address: schema_geolocation_address,
});