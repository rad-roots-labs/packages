import type {
    RadrootsCoreMoney,
    RadrootsCoreQuantity,
    RadrootsCoreQuantityPrice,
} from "@radroots/core-bindings";
import {
    type RadrootsListing,
    type RadrootsListingDiscount,
    type RadrootsListingImage,
    type RadrootsListingLocation,
    type RadrootsListingQuantity,
    radroots_listing_discount_schema,
    radroots_listing_image_schema,
    radroots_listing_location_schema,
    radroots_listing_price_schema,
    radroots_listing_product_schema,
    radroots_listing_quantity_schema,
    radroots_listing_schema,
} from "@radroots/events-bindings";
import type { NostrEvent } from "../../types/nostr.js";
import { get_event_tag, get_event_tags, parse_nostr_event_basis } from "../lib.js";
import type { NostrEventBasis } from "../subscription.js";
import { KIND_RADROOTS_LISTING, type KindRadrootsListing } from "./lib.js";

export type RadrootsListingNostrEvent = NostrEventBasis<KindRadrootsListing> & { listing: RadrootsListing };

type CoreUnit = RadrootsCoreQuantity["unit"];
type CoreCurrency = RadrootsCoreMoney["currency"];

type ListingLocationDraft = {
    primary?: string;
    city?: string;
    region?: string;
    country?: string;
    geohash?: string;
    lat?: number;
    lng?: number;
};

type ListingImageDraft = {
    url: string;
    size?: {
        w: number;
        h: number;
    };
};

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

const parse_quantity_tag = (tag: string[]): RadrootsListingQuantity | undefined => {
    if (tag.length < 3) return undefined;
    const amount = to_number(tag[1]);
    const unit = parse_unit_code(tag[2]);
    if (amount === undefined || !unit) return undefined;
    const label = clean_string(tag[3]);
    const count = to_number(tag[4]);
    const value: RadrootsCoreQuantity = label ? { amount, unit, label } : { amount, unit };
    return radroots_listing_quantity_schema.parse({ value, label, count });
};

const parse_price_tag = (tag: string[]): RadrootsCoreQuantityPrice | undefined => {
    if (tag.length < 5) return undefined;
    const amount = to_number(tag[1]);
    const currency = parse_currency_code(tag[2]);
    const quantity_amount = to_number(tag[3]);
    const quantity_unit = parse_unit_code(tag[4]);
    if (amount === undefined || !currency || quantity_amount === undefined || !quantity_unit) return undefined;
    const label = clean_string(tag[5]);
    const money: RadrootsCoreMoney = { amount, currency };
    const quantity: RadrootsCoreQuantity = label
        ? { amount: quantity_amount, unit: quantity_unit, label }
        : { amount: quantity_amount, unit: quantity_unit };
    return radroots_listing_price_schema.parse({ amount: money, quantity });
};

const parse_discount_tag = (tag: string[]): RadrootsListingDiscount | undefined => {
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

const parse_image_tag = (tag: string[]): RadrootsListingImage | undefined => {
    if (tag[0] !== "image" || !tag[1]) return undefined;
    const image: ListingImageDraft = { url: tag[1] };
    if (tag[2]) {
        const [w, h] = tag[2].split("x").map(v => Number(v));
        if (Number.isFinite(w) && Number.isFinite(h)) image.size = { w, h };
    }
    return radroots_listing_image_schema.parse(image);
};

const is_listing_quantity = (value: RadrootsListingQuantity | undefined): value is RadrootsListingQuantity =>
    Boolean(value);

const is_listing_price = (value: RadrootsCoreQuantityPrice | undefined): value is RadrootsCoreQuantityPrice =>
    Boolean(value);

const is_listing_discount = (
    value: RadrootsListingDiscount | undefined,
): value is RadrootsListingDiscount => Boolean(value);

const is_listing_image = (value: RadrootsListingImage | undefined): value is RadrootsListingImage =>
    Boolean(value);

export const parse_nostr_listing_event = (
    event: NostrEvent,
): RadrootsListingNostrEvent | undefined => {
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
            year: get_event_tag(tags, "year"),
        };

        const product = radroots_listing_product_schema.parse(product_raw);

        const quantities = get_event_tags(tags, "quantity")
            .map(parse_quantity_tag)
            .filter(is_listing_quantity);

        const prices = get_event_tags(tags, "price")
            .map(parse_price_tag)
            .filter(is_listing_price);

        const discounts = tags
            .filter(t => t[0]?.startsWith("price-discount-"))
            .map(parse_discount_tag)
            .filter(is_listing_discount);

        const images = get_event_tags(tags, "image")
            .map(parse_image_tag)
            .filter(is_listing_image);

        const location_parts = get_event_tags(tags, "location")[0]?.slice(1) ?? [];

        const location_raw: ListingLocationDraft = {};
        if (location_parts[0]) location_raw.primary = location_parts[0];
        if (location_parts[1]) location_raw.city = location_parts[1];
        if (location_parts[2]) location_raw.region = location_parts[2];
        if (location_parts[3]) location_raw.country = location_parts[3];

        if (location_raw.primary) {
            const geohash = get_event_tags(tags, "g")[0]?.[1];
            if (geohash) location_raw.geohash = geohash;

            for (const loc_tag of get_event_tags(tags, "l")) {
                if (loc_tag.length < 3) continue;
                const coord = Number(loc_tag[1]);
                if (!Number.isFinite(coord)) continue;
                if (loc_tag[2] === "dd.lat") location_raw.lat = coord;
                if (loc_tag[2] === "dd.lon") location_raw.lng = coord;
            }
        }

        const location = location_raw.primary
            ? radroots_listing_location_schema.parse(location_raw as RadrootsListingLocation)
            : undefined;

        const listing = radroots_listing_schema.parse({
            d_tag,
            product,
            quantities,
            prices,
            discounts: discounts.length ? discounts : undefined,
            location,
            images: images.length ? images : undefined,
        });
        return { ...ev, listing };
    } catch {
        return undefined;
    }
};
