import { NDKEvent } from "@nostr-dev-kit/ndk";
import { nostr_event_listing_schema, nostr_tag_listing_schema, nostr_tag_location_schema, nostr_tag_price_schema, nostr_tag_quantity_schema } from "../../schemas/lib.js";
import { NostrEventListing } from "../../types/lib.js";
import { get_event_tag, get_event_tags } from "../lib.js";

export const parse_nostr_listing_event = (event: NDKEvent): NostrEventListing | undefined => {
    if (!event || event.kind !== 30402 || !Array.isArray(event.tags)) return;

    try {
        const tags = event.tags;

        const d_tag = get_event_tag(tags, 'd');

        const listing_raw = {
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

        const listing = nostr_tag_listing_schema.parse(listing_raw);

        const quantities = get_event_tags(tags, 'quantity')
            .map(q => {
                if (q.length < 3) return undefined;
                return nostr_tag_quantity_schema.parse({
                    amt: q[1],
                    unit: q[2],
                    label: q[3]
                });
            })
            .filter(Boolean);

        const prices = get_event_tags(tags, 'price')
            .map(p => {
                if (p.length < 6) return undefined;
                return nostr_tag_price_schema.parse({
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
            ? nostr_tag_location_schema.parse(location_raw)
            : undefined;

        const parsed = nostr_event_listing_schema.parse({
            d_tag,
            listing,
            quantities,
            prices,
            location
        });

        return parsed;
    } catch {
        return undefined;
    }
};
