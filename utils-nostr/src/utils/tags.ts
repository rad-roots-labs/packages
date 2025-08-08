import ngeotags, { type InputData as NostrGeotagsInputData } from "nostr-geotags";
import { NostrEventListing, NostrEventTag, NostrEventTagClient, NostrEventTagImage, NostrEventTagLocation, NostrEventTagPrice, NostrEventTagPriceDiscount, NostrEventTagQuantity, NostrEventTags } from "../types/lib.js";

export const tag_client = (opts: NostrEventTagClient, d_tag?: string): NostrEventTag => {
    const tag = [`client`, opts.name];
    if (d_tag) tag.push(`31990:${opts.pubkey}:${d_tag}`);
    tag.push(opts.relay);
    return tag;
};

export const tag_classified_quantity = (opts: NostrEventTagQuantity): NostrEventTag => {
    const tag = [`quantity`, opts.amt, opts.unit];
    if (opts.label) tag.push(opts.label);
    return tag.map(i => i.toLowerCase());
};

export const tag_classified_price = (price: NostrEventTagPrice): NostrEventTag => {
    const tag = [`price`, price.amt, price.currency, price.qty_amt, price.qty_unit, price.qty_key];
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

export const tag_classified_location = (opts: NostrEventTagLocation): NostrEventTag => {
    if (!opts.primary) return [];
    const tag = [`location`, opts.primary];
    if (opts.city) tag.push(opts.city);
    if (opts.region) tag.push(opts.region);
    if (opts.country) tag.push(opts.country);
    return tag;
};

export const tags_classified_location_geotags = (opts: NostrEventTagLocation): NostrEventTags => {
    const { lat, lng: lon, city, region: regionName, country } = opts;
    const country_raw = country || ``;
    const countryCode = country_raw && country_raw?.length <= 3 ? country_raw : undefined;
    const countryName = country_raw && country_raw?.length > 3 ? country_raw : undefined;
    return ngeotags({ lat, lon, city, regionName, countryCode, countryName } satisfies NostrGeotagsInputData, { geohash: true, gps: true, city: true, iso31662: true });
};


export const tag_classified_image = (opts: NostrEventTagImage): NostrEventTag => {
    const tag = [`image`, opts.url];
    if (opts.size) tag.push(`${opts.size.w}x${opts.size.h}`)
    return tag;
};

export const tags_classified = (opts: NostrEventListing): NostrEventTags => {
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
        tags.push(...tags_classified_location_geotags(opts.location));
    }
    if (opts.images) for (const image_tags of opts.images) tags.push(tag_classified_image(image_tags));
    return tags;
};
