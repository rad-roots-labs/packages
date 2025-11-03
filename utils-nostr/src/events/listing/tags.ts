import { RadrootsListingDiscount, RadrootsListingPrice, RadrootsListingQuantity, type RadrootsListing } from "@radroots/events-bindings";
import ngeotags, { type InputData as NostrGeotagsInputData } from "nostr-geotags";
import { NostrEventTag, NostrEventTagImage, NostrEventTagLocation, NostrEventTags } from "../../types/lib.js";

const tags_map = (tag: any[]) => tag.map(i => String(i).toLowerCase());

export const tag_listing_quantity = (opts: RadrootsListingQuantity): NostrEventTag => {
    const tag = [`quantity`, opts.value.amount, opts.value.unit];
    if (opts.label) tag.push(opts.label);
    return tags_map(tag);
};

export const tag_listing_price = (price: RadrootsListingPrice): NostrEventTag => {
    const tag = [`price`, price.amount, price.amount.amount, price.quantity.amount, price.quantity.unit, price.quantity.label || ``];
    return tags_map(tag);
};

export const tag_listing_price_discount = (discount: RadrootsListingDiscount): NostrEventTag => {
    const tag = [`price-discount-${Object.keys(discount)[0]}`];
    for (const [key, value] of Object.entries(discount.amount)) tag.push(`${key}:${value}`);
    return tags_map(tag);
};

export const tag_listing_location = (opts: NostrEventTagLocation): NostrEventTag => {
    if (!opts.primary) return [];
    const tag = [`location`, opts.primary];
    if (opts.city) tag.push(opts.city);
    if (opts.region) tag.push(opts.region);
    if (opts.country) tag.push(opts.country);
    return tag;
};

export const tags_listing_location_geotags = (opts: NostrEventTagLocation): NostrEventTags => {
    const { lat, lng: lon, city, region: regionName, country } = opts;
    const country_raw = country || ``;
    const countryCode = country_raw && country_raw?.length <= 3 ? country_raw : undefined;
    const countryName = country_raw && country_raw?.length > 3 ? country_raw : undefined;
    return ngeotags({ lat, lon, city, regionName, countryCode, countryName } satisfies NostrGeotagsInputData, { geohash: true, gps: true, city: true, iso31662: true });
};


export const tag_listing_image = (opts: NostrEventTagImage): NostrEventTag => {
    const tag = [`image`, opts.url];
    if (opts.size) tag.push(`${opts.size.w}x${opts.size.h}`)
    return tag;
};

export const tags_listing = (opts: RadrootsListing): NostrEventTags => {
    const { d_tag, product, quantities, prices } = opts;
    const tags: NostrEventTags = [[`d`, d_tag]];
    for (const [k, v] of Object.entries(product)) if (v) tags.push([k, String(v)]);
    for (const quantity of quantities) {
        tags.push(tag_listing_quantity(quantity));
    }
    for (const price of prices) {
        tags.push(tag_listing_price(price));
    }
    for (const discount of opts.discounts || []) {
        tags.push(tag_listing_price_discount(discount));
    }
    if (opts.location) {
        tags.push(tag_listing_location(opts.location));
        tags.push(...tags_listing_location_geotags(opts.location));
    }
    if (opts.images) for (const image_tags of opts.images) tags.push(tag_listing_image(image_tags));
    return tags;
};