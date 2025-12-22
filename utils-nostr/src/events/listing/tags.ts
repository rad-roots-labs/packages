import type { RadrootsCoreQuantityPrice } from "@radroots/core-bindings";
import type { RadrootsListing, RadrootsListingDiscount, RadrootsListingImage, RadrootsListingLocation, RadrootsListingQuantity } from "@radroots/events-bindings";
import ngeotags, { type InputData as NostrGeotagsInputData } from "nostr-geotags";
import { NostrEventTag, NostrEventTagLocation, NostrEventTags } from "../../types/lib.js";

type CoreUnit = RadrootsListingQuantity["value"]["unit"];
type CoreCurrency = RadrootsCoreQuantityPrice["amount"]["currency"];

const currency_to_code = (currency: CoreCurrency): string => {
    if (Array.isArray(currency) && currency.length >= 3) {
        const [a, b, c] = currency;
        return String.fromCharCode(Number(a), Number(b), Number(c));
    }
    return String(currency);
};

const unit_to_code = (unit: CoreUnit): string => {
    switch (unit) {
        case "Each": return "each";
        case "MassKg": return "kg";
        case "MassG": return "g";
        case "MassOz": return "oz";
        case "MassLb": return "lb";
        case "VolumeL": return "l";
        case "VolumeMl": return "ml";
        default: return String(unit).toLowerCase();
    }
};

const clean_label = (value?: string | null) => value?.trim() || undefined;

const normalize_listing_location = (location?: RadrootsListingLocation | null): NostrEventTagLocation | undefined => {
    if (!location?.primary) return undefined;
    const { primary, city, region, country, lat, lng } = location;
    return {
        primary,
        city: city ?? undefined,
        region: region ?? undefined,
        country: country ?? undefined,
        lat: typeof lat === "number" ? lat : undefined,
        lng: typeof lng === "number" ? lng : undefined,
    };
};

const normalize_image_size = (size: RadrootsListingImage["size"]) =>
    size && typeof size?.w === "number" && typeof size?.h === "number" ? size : undefined;

export const tag_listing_quantity = (opts: RadrootsListingQuantity): NostrEventTag => {
    const tag: NostrEventTag = ["quantity", String(opts.value.amount), unit_to_code(opts.value.unit)];
    const label = clean_label(opts.label ?? opts.value.label);
    if (label) tag.push(label);
    if (opts.count !== undefined && opts.count !== null) tag.push(String(opts.count));
    return tag;
};

export const tag_listing_price = (price: RadrootsCoreQuantityPrice): NostrEventTag => {
    const tag: NostrEventTag = [
        "price",
        String(price.amount.amount),
        currency_to_code(price.amount.currency).toLowerCase(),
        String(price.quantity.amount),
        unit_to_code(price.quantity.unit),
    ];
    const label = clean_label(price.quantity.label);
    if (label) tag.push(label);
    return tag;
};

export const tag_listing_price_discount = (discount: RadrootsListingDiscount): NostrEventTag => {
    const tag: NostrEventTag = [`price-discount-${discount.kind}`];
    tag.push(JSON.stringify(discount.amount));
    return tag;
};

export const tag_listing_location = (opts: NostrEventTagLocation): NostrEventTag => {
    if (!opts.primary) return [];
    const tag: NostrEventTag = ["location", opts.primary];
    if (opts.city) tag.push(opts.city);
    if (opts.region) tag.push(opts.region);
    if (opts.country) tag.push(opts.country);
    return tag;
};

export const tags_listing_location_geotags = (opts: NostrEventTagLocation): NostrEventTags => {
    const { lat, lng: lon, city, region, country } = opts;
    const country_raw = country || ``;
    const country_code = country_raw && country_raw?.length <= 3 ? country_raw : undefined;
    const country_name = country_raw && country_raw?.length > 3 ? country_raw : undefined;
    const input: NostrGeotagsInputData = { lat, lon, city, regionName: region, countryCode: country_code, countryName: country_name };
    return ngeotags(input, { geohash: true, gps: true, city: true, iso31662: true });
};

export const tag_listing_image = (opts: RadrootsListingImage): NostrEventTag => {
    const tag: NostrEventTag = ["image", opts.url];
    const size = normalize_image_size(opts.size);
    if (size) tag.push(`${size.w}x${size.h}`);
    return tag;
};

export const tags_listing = (opts: RadrootsListing): NostrEventTags => {
    const { d_tag, product, quantities, prices } = opts;
    const tags: NostrEventTags = [["d", d_tag]];
    for (const [k, v] of Object.entries(product)) if (v) tags.push([k, String(v)]);
    for (const quantity of quantities) {
        tags.push(tag_listing_quantity(quantity));
    }
    for (const price of prices) {
        tags.push(tag_listing_price(price));
    }
    if (opts.discounts?.length) for (const discount of opts.discounts) if (discount) tags.push(tag_listing_price_discount(discount));
    const location = normalize_listing_location(opts.location);
    if (location) {
        tags.push(tag_listing_location(location));
        tags.push(...tags_listing_location_geotags(location));
    }
    if (opts.images) for (const image_tags of opts.images) if (image_tags) tags.push(tag_listing_image(image_tags));
    return tags;
};
