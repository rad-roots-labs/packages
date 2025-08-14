import { NDKEvent } from "@nostr-dev-kit/ndk";
import { type RadrootsListing, radroots_listing_location_schema, radroots_listing_price_schema, radroots_listing_product_schema, radroots_listing_quantity_schema, radroots_listing_schema } from "@radroots/radroots-common-bindings";
import { get_event_tag, get_event_tags, parse_nostr_event_basis } from "../lib.js";
import { NdkEventBasis } from "../subscription.js";
import { KIND_RADROOTS_LISTING, type KindRadrootsListing } from "./lib.js";

export type RadrootsListingNostrEvent = NdkEventBasis<KindRadrootsListing> & { listing: RadrootsListing; }

export const parse_nostr_listing_event = (event: NDKEvent): RadrootsListingNostrEvent | undefined => {
    const ev = parse_nostr_event_basis(event, KIND_RADROOTS_LISTING);
    if (!ev) return undefined;
    try {
        const tags = event.tags;

        const d_tag = get_event_tag(tags, 'd');

        const product_raw = {
            key: get_event_tag(tags, 'key'),
            title: get_event_tag(tags, 'title'),
            category: get_event_tag(tags, 'category'),
            summary: get_event_tag(tags, 'summary'),
            process: get_event_tag(tags, 'process'),
            lot: get_event_tag(tags, 'lot'),
            location: get_event_tag(tags, 'location'),
            profile: get_event_tag(tags, 'profile'),
            year: get_event_tag(tags, 'year')
        };

        const product = radroots_listing_product_schema.parse(product_raw);

        const quantities = get_event_tags(tags, 'quantity')
            .map(q => {
                if (q.length < 3) return undefined;
                return radroots_listing_quantity_schema.parse({
                    amt: q[1],
                    unit: q[2],
                    label: q[3]
                });
            })
            .filter(Boolean);

        const prices = get_event_tags(tags, 'price')
            .map(p => {
                if (p.length < 6) return undefined;
                return radroots_listing_price_schema.parse({
                    amt: p[1],
                    currency: p[2],
                    qty_amt: p[3],
                    qty_unit: p[4],
                    qty_key: p[5]
                });
            })
            .filter(Boolean);

        const location_parts = get_event_tags(tags, 'location')[0]?.slice(1) ?? [];

        const location_raw: any = {};
        if (location_parts[0]) location_raw.primary = location_parts[0];
        if (location_parts[1]) location_raw.city = location_parts[1];
        if (location_parts[2]) location_raw.region = location_parts[2];
        if (location_parts[3]) location_raw.country = location_parts[3];

        const location = Object.keys(location_raw).length
            ? radroots_listing_location_schema.parse(location_raw)
            : undefined;

        const listing = radroots_listing_schema.parse({
            d_tag,
            product,
            quantities,
            prices,
            location
        });
        return { ...ev, listing };
    } catch {
        return undefined;
    }
};
