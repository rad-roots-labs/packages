import { dev } from "$app/environment";
import type { IViewFarmsAddSubmission, IViewFarmsProductsAddSubmitPayload } from "$lib/types/views/farms";
import { form_fields, schema_geocode_result, schema_geolocation_point, util_rxp, zf_numf_pos, zf_numi_pos, zf_price } from "@radroots/utils";
import { z } from "zod";

export const schema_view_farms_add_submission: z.ZodSchema<IViewFarmsAddSubmission> = z.object({
    farm_name: z.string().regex(form_fields.farm_name.validate),
    farm_area: zf_numf_pos.optional(),
    farm_area_unit: z.string().regex(form_fields.area_unit.validate).optional(),
    farm_contact_name: z.string().regex(form_fields.contact_name.validate).optional(),
    geolocation_point: schema_geolocation_point,
    geocode_result: schema_geocode_result,
});

export const schema_view_farms_products_add_submission: z.ZodSchema<IViewFarmsProductsAddSubmitPayload> = z.object({
    product: z.string().regex(form_fields.product_key.validate),
    process: z.string().regex(form_fields.product_process.validate),
    description: z.string().regex(form_fields.product_description.validate),
    price_amount: zf_price,
    price_currency: z.string().regex(form_fields.price_currency.validate),
    price_quantity_unit: z.string().regex(form_fields.quantity_unit.validate),
    photos: z.array(z.string().regex(dev ? util_rxp.url_image_upload_dev : util_rxp.url_image_upload)),
    quantity_amount: zf_numi_pos,
    quantity_unit: z.string().regex(form_fields.quantity_unit.validate),
    quantity_label: z.string().regex(form_fields.quantity_label.validate),
    geolocation_point: schema_geolocation_point,
    geocode_result: schema_geocode_result,
});