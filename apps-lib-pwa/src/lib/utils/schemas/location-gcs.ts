import type { LocationGcs } from "@radroots/tangle-schema-bindings";
import type { LocationBasis } from "@radroots/utils";

export const location_gcs_to_location_basis = ({
    id,
    lat,
    lng,
    gc_name: primary,
    gc_admin1_name: admin,
    gc_country_id: country,
}: LocationGcs): LocationBasis => ({
    id,
    point: {
        lat,
        lng,
    },
    address: primary && admin && country ? {
        primary,
        admin,
        country,
    } : undefined
});