import { NDKEvent } from "@nostr-dev-kit/ndk";
import type { RadrootsCoreMoney, RadrootsCoreQuantity, RadrootsCoreQuantityPrice } from "@radroots/core-bindings";
import { type RadrootsListing, type RadrootsListingDiscount, radroots_listing_discount_schema, radroots_listing_image_schema, radroots_listing_location_schema, radroots_listing_price_schema, radroots_listing_product_schema, radroots_listing_quantity_schema, radroots_listing_schema } from "@radroots/events-bindings";
import { get_event_tag, get_event_tags, parse_nostr_event_basis } from "../lib.js";
import { NdkEventBasis } from "../subscription.js";
import { KIND_RADROOTS_LISTING, type KindRadrootsListing } from "./lib.js";

export type RadrootsListingNostrEvent = NdkEventBasis<KindRadrootsListing> & { listing: RadrootsListing; };

type CoreUnit = RadrootsCoreQuantity["unit"];
type CoreCurrency = RadrootsCoreMoney["currency"];

const to_number = (value?: string): number | undefined => {
    if (value === undefined) return undefined;
    const num = Number(value);
    return Number.isFinite(num) ? num : undefined;
};

const clean_string = (value?: string | null) => value?.trim() || undefined;

const parse_currency_code = (code?: string): CoreCurrency | undefined => {
    const cleaned = clean_string(code);
    if (!cleaned || cleaned.length < 3) return undefined;
    const upper = cleaned.toUpperCase();
    return [upper.charCodeAt(0), upper.charCodeAt(1), upper.charCodeAt(2)] as CoreCurrency;
};

const parse_unit_code = (unit?: string): CoreUnit | undefined => {
    switch ((unit ?? "").trim().toLowerCase()) {
        case "each":
        case "ea":
        case "count":
            return "Each" as CoreUnit;
        case "kg":
        case "kilogram":
        case "kilograms":
            return "MassKg" as CoreUnit;
        case "g":
        case "gram":
        case "grams":
            return "MassG" as CoreUnit;
        case "oz":
        case "ounce":
        case "ounces":
            return "MassOz" as CoreUnit;
        case "lb":
        case "pound":
        case "pounds":
            return "MassLb" as CoreUnit;
        case "l":
        case "liter":
        case "litre":
        case "liters":
        case "litres":
            return "VolumeL" as CoreUnit;
        case "ml":
        case "milliliter":
        case "millilitre":
        case "milliliters":
        case "millilitres":
            return "VolumeMl" as CoreUnit;
        default:
            return undefined;
    }
};

const parse_quantity_tag = (tag: string[]) => {
    if (tag.length < 3) return undefined;
    const amount = to_number(tag[1]);
    const unit = parse_unit_code(tag[2]);
    if (amount === undefined || !unit) return undefined;
    const label = clean_string(tag[3]);
    const count = to_number(tag[4]);
    const value: RadrootsCoreQuantity = label ? { amount, unit, label } : { amount, unit };
    return radroots_listing_quantity_schema.parse({ value, label, count });
};

const parse_price_tag = (tag: string[]) => {
    if (tag.length < 5) return undefined;
    const amount = to_number(tag[1]);
    const currency = parse_currency_code(tag[2]);
    const quantity_amount = to_number(tag[3]);
    const quantity_unit = parse_unit_code(tag[4]);
    if (amount === undefined || !currency || quantity_amount === undefined || !quantity_unit) return undefined;
    const label = clean_string(tag[5]);
    const money: RadrootsCoreMoney = { amount, currency };
    const quantity: RadrootsCoreQuantity = label ? { amount: quantity_amount, unit: quantity_unit, label } : { amount: quantity_amount, unit: quantity_unit };
    return radroots_listing_price_schema.parse({ amount: money, quantity });
};

const parse_discount_tag = (tag: string[]) => {
    const prefix = "price-discount-";
    if (!tag[0]?.startsWith(prefix) || tag.length < 2) return undefined;
    const kind = tag[0].slice(prefix.length) as RadrootsListingDiscount["kind"];
    try {
        const amount = JSON.parse(tag[1]);
        return radroots_listing_discount_schema.parse({ kind, amount });
    } catch {
        return undefined;
    }
};

const parse_image_tag = (tag: string[]) => {
    if (tag[0] !== "image" || !tag[1]) return undefined;
    const image: any = { url: tag[1] };
    if (tag[2]) {
        const [w, h] = tag[2].split("x").map(v => Number(v));
        if (Number.isFinite(w) && Number.isFinite(h)) image.size = { w, h };
    }
    return radroots_listing_image_schema.parse(image);
};

export const parse_nostr_listing_event = (event: NDKEvent): RadrootsListingNostrEvent | undefined => {
    const ev = parse_nostr_event_basis(event, KIND_RADROOTS_LISTING);
    if (!ev) return undefined;
    try {
        const tags = event.tags;

        const d_tag = get_event_tag(tags, "d");

        const product_raw = {
            key: get_event_tag(tags, "key"),
            title: get_event_tag(tags, "title"),
            category: get_event_tag(tags, "category"),
            summary: get_event_tag(tags, "summary"),
            process: get_event_tag(tags, "process"),
            lot: get_event_tag(tags, "lot"),
            location: get_event_tag(tags, "location"),
            profile: get_event_tag(tags, "profile"),
            year: get_event_tag(tags, "year")
        };

        const product = radroots_listing_product_schema.parse(product_raw);

        const quantities = get_event_tags(tags, "quantity")
            .map(parse_quantity_tag)
            .filter(Boolean) as RadrootsListing["quantities"];

        const prices = get_event_tags(tags, "price")
            .map(parse_price_tag)
            .filter(Boolean) as RadrootsCoreQuantityPrice[];

        const discounts = tags
            .filter(t => t[0]?.startsWith("price-discount-"))
            .map(parse_discount_tag)
            .filter(Boolean);

        const images = get_event_tags(tags, "image")
            .map(parse_image_tag)
            .filter(Boolean);

        const location_parts = get_event_tags(tags, "location")[0]?.slice(1) ?? [];

        const location_raw: any = {};
        if (location_parts[0]) location_raw.primary = location_parts[0];
        if (location_parts[1]) location_raw.city = location_parts[1];
        if (location_parts[2]) location_raw.region = location_parts[2];
        if (location_parts[3]) location_raw.country = location_parts[3];

        if (location_raw.primary) {
            const geohash = get_event_tags(tags, "g")[0]?.[1];
            if (geohash) location_raw.geohash = geohash;

            for (const locTag of get_event_tags(tags, "l")) {
                if (locTag.length < 3) continue;
                const coord = Number(locTag[1]);
                if (!Number.isFinite(coord)) continue;
                if (locTag[2] === "dd.lat") location_raw.lat = coord;
                if (locTag[2] === "dd.lon") location_raw.lng = coord;
            }
        }

        const location = location_raw.primary
            ? radroots_listing_location_schema.parse(location_raw)
            : undefined;

        const listing = radroots_listing_schema.parse({
            d_tag,
            product,
            quantities,
            prices,
            discounts: discounts.length ? discounts : undefined,
            location,
            images: images.length ? images : undefined
        });
        return { ...ev, listing };
    } catch {
        return undefined;
    }
};
