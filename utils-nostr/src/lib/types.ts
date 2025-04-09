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

export type INostrClassified = {
    d_tag: string;
    listing: NostrEventTagListing;
    quantity: NostrEventTagQuantity;
    price: NostrEventTagPrice;
    location: NostrEventTagLocation;
    images?: NostrEventTagMediaUpload[];
    client?: NostrEventTagClient;
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

export type NostrEventTagPrice = {
    amt: string;
    currency: string;
    qty_amt: string;
    qty_unit: string;
};

export type NostrEventTagQuantity = {
    amt: string;
    unit: string;
    label?: string;
};

export type NostrEventTagLocation = {
    city?: string;
    region?: string;
    region_code?: string;
    country?: string;
    country_code?: string;
    lat: number;
    lng: number;
    geohash: string;
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
