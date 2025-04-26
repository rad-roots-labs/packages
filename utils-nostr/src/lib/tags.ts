import { INostrClassified, INostrJobRequest, NostrEventTagClient, NostrEventTagLocation, NostrEventTagMediaUpload, NostrEventTagPrice, NostrEventTagPriceDiscount, NostrEventTagQuantity, type INostrFollow, type NostrEventTag, type NostrEventTags } from "$root";
import { ngeotags, type InputData as NostrGeotagsInputData } from "nostr-geotags";

export const tag_client = (opts: NostrEventTagClient, d_tag?: string): NostrEventTag => {
    const tag = [`client`, opts.name];
    if (d_tag) tag.push(`31990:${opts.pubkey}:${d_tag}`);
    tag.push(opts.relay);
    return tag;
};

export const tags_follow_list = (list: INostrFollow[]): NostrEventTags => {
    return list.map(({ public_key, relay_url, contact_name }) => {
        const entry = [`p`, public_key];
        if (relay_url) entry.push(relay_url);
        if (contact_name) entry.push(contact_name);
        return entry;
    });
};

export const tag_classified_quantity = (opts: NostrEventTagQuantity): NostrEventTag => {
    const tag = [`quantity`, opts.amt, opts.unit];
    if (opts.label) tag.push(opts.label);
    return tag.map(i => i.toLowerCase());
};

export const tag_classified_price_discount = (discount: NostrEventTagPriceDiscount): NostrEventTag => {
    const tag = [`price-discount-${Object.keys(discount)[0]}`];
    if (`mass` in discount) tag.push(...Object.values(discount.mass));
    else if (`quantity` in discount) tag.push(...Object.values(discount.quantity));
    else if (`subtotal` in discount) tag.push(...Object.values(discount.subtotal));
    else if (`total` in discount) tag.push(...Object.values(discount.total));
    return tag.map(i => i.toLowerCase());
};

export const tag_classified_price = (price: NostrEventTagPrice): NostrEventTag => {
    const tag = [`price`, price.amt, price.currency, price.qty_amt, price.qty_unit, price.qty_key];
    return tag.map(i => i.toLowerCase());
};

export const tag_classified_image = (opts: NostrEventTagMediaUpload): NostrEventTag => {
    const tag = [`image`, opts.url];
    if (opts.size) tag.push(`${opts.size.w}x${opts.size.h}`)
    return tag;
};

export const tag_classified_location = (opts: NostrEventTagLocation): NostrEventTag => {
    const tag = [`location`];
    if (opts.city) tag.push(opts.city);
    if (opts.region_code && !isNaN(parseInt(opts.region_code))) tag.push(opts.region_code);
    else if (opts.region) tag.push(opts.region); //@todo 
    if (opts.country_code) tag.push(opts.country_code);
    return tag;
};

export const tags_classified_location_geotags = (opts: NostrEventTagLocation): NostrEventTags => {
    const { lat, lng: lon, city, region: regionName, country: countryName, country_code: countryCode } = opts;
    return ngeotags({ lat, lon, city, regionName, countryName, countryCode } satisfies NostrGeotagsInputData, { geohash: true, gps: true, city: true, iso31662: true });
};

export const tags_classified = (opts: INostrClassified): NostrEventTags => {
    const { d_tag, listing, quantities, prices } = opts;
    const tags: NostrEventTags = [[`d`, d_tag]];
    if (opts.client) tags.push(tag_client(opts.client, opts.d_tag));
    for (const [k, v] of Object.entries(listing)) if (v) tags.push([k, v]);
    for (const quantity of quantities) {
        tags.push(tag_classified_quantity(quantity));
    }
    for (const price of prices) {
        tags.push(tag_classified_price(price));
    }
    for (const discount of opts.discounts || []) {
        tags.push(tag_classified_price_discount(discount));
    }
    if (opts.location) {
        tags.push(tag_classified_location(opts.location));
        //tags.push(...tags_classified_location_geotags(opts.location));
    }
    if (opts.images) for (const image_tags of opts.images) tags.push(tag_classified_image(image_tags));
    return tags;
};

export const tags_job_request = (opts: INostrJobRequest): NostrEventTags => {
    const tag_i: string[] = [`i`];
    if (`classified` in opts.input && opts.input?.classified) {
        const { classified: event_request } = opts.input;
        let marker = `*`;
        let data = `*`;
        if (event_request.marker && `order` in event_request.marker) {
            marker = `order`;
            data = JSON.stringify({ event: { id: event_request.id }, order: event_request.marker.order });
        }
        tag_i.push(...[data, `text`, event_request.relay, marker]);
        tag_i.push(...(opts.input.tags || []))
    }

    const tags: NostrEventTags = [tag_i];
    tags.push(...(opts.tags || []))
    return tags;
};
