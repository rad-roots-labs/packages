import { z } from 'zod';
import { nostr_event_listing_schema, nostr_event_metadata_schema, nostr_tag_client_schema, nostr_tag_discount_schema, nostr_tag_image_schema, nostr_tag_listing_schema, nostr_tag_location_schema, nostr_tag_price_schema, nostr_tag_quantity_schema } from "../schemas/lib.js";

export type NostrEventMetadata = z.infer<typeof nostr_event_metadata_schema>;
export type NostrEventListing = z.infer<typeof nostr_event_listing_schema>
export type NostrTagClient = z.infer<typeof nostr_tag_client_schema>
export type NostrTagMediaUpload = z.infer<typeof nostr_tag_image_schema>
export type NostrTagLocation = z.infer<typeof nostr_tag_location_schema>
export type NostrTagPriceDiscount = z.infer<typeof nostr_tag_discount_schema>
export type NostrTagPrice = z.infer<typeof nostr_tag_price_schema>
export type NostrTagQuantity = z.infer<typeof nostr_tag_quantity_schema>
export type NostrTagListing = z.infer<typeof nostr_tag_listing_schema>

export type NostrEventTag = string[];
export type NostrEventTags = NostrEventTag[];

export type NostrEventTagClient = {
    name: string;
    pubkey: string;
    relay: string;
};

export type NostrEventTagQuantity = {
    amt: string;
    unit: string;
    label?: string;
};

export type NostrEventTagPrice = {
    amt: string;
    currency: string;
    qty_amt: string;
    qty_unit: string;
    qty_key: string;
};

export type NostrEventTagPriceDiscount = (
    {
        quantity: {
            ref_quantity: string;
            threshold: string;
            value: string;
            currency: string;
        }
    } |
    {
        mass: {
            unit: string;
            threshold: string;
            threshold_unit: string;
            value: string;
            currency: string;
        }
    } |
    {
        subtotal: {
            threshold: string;
            currency: string;
            value: string;
            measure: string;
        }
    } |
    {
        total: {
            total_min: string;
            value: string;
            measure: string;
        }
    }
);

export type NostrEventTagLocation = {
    primary: string;
    city?: string;
    region?: string;
    country?: string;
    lat?: number;
    lng?: number;
};

export type NostrEventTagImage = {
    url: string;
    size?: {
        w: number;
        h: number;
    };
};