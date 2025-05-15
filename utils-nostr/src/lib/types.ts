import { ListingOrder } from "@radroots/radroots-common-bindings";
import { type EventTemplate as NostrToolsEventTemplate } from "nostr-tools";

export type INostrMetadata = {
    name?: string;
    display_name?: string;
    about?: string;
    website?: string;
    picture?: string;
    banner?: string;
    nip05?: string;
    lud06?: string;
    lud16?: string;
    bot?: boolean;
};

export type INostrFollow = {
    public_key: string;
    relay_url?: string;
    contact_name?: string;
};

export type NostrEventTagQuantity = {
    amt: string;
    unit: string;
    label?: string;
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

export type NostrEventTagPrice = {
    amt: string;
    currency: string;
    qty_amt: string;
    qty_unit: string;
    qty_key: string;
};

export type INostrClassified = {
    d_tag: string;
    listing: NostrEventTagListing;
    quantities: NostrEventTagQuantity[];
    prices: NostrEventTagPrice[];
    discounts?: NostrEventTagPriceDiscount[];
    location?: NostrEventTagLocation;
    images?: NostrEventTagMediaUpload[];
    client?: NostrEventTagClient;
};

export type NostrJobRequestMassUnit = 'g' | 'kg' | 'lb';

export type INostrJobRequestInput = {
    tags?: string[];
} & ({
    classified: {
        id: string;
        relay: string;
        marker?: ({
            order: ListingOrder;
        });
    }
})

export type INostrJobRequest = {
    input: INostrJobRequestInput;
    tags?: string[][];
};

export type INostrEventEventSign = {
    secret_key: string;
    event: NostrToolsEventTemplate;
}

export type NostrEventTagListing = {
    key: string;
    title: string;
    category: string;
    summary?: string;
    process?: string;
    lot?: string;
    location?: string;
    profile?: string;
    year?: string;
};

export type NostrEventTagLocation = {
    primary: string;
    city?: string;
    region?: string;
    country?: string;
    lat?: number;
    lng?: number;
};

export type NostrEventTagMediaUpload = {
    url: string;
    size?: {
        w: number;
        h: number;
    };
};

export type NostrEventTagClient = {
    name: string;
    pubkey: string;
    relay: string;
};

export type INostrReaction = {
    ref_event: {
        id: string;
        kind: number;
        author: string;
        relays?: string[];
        d_tag?: string;
    },
    content: string;
};