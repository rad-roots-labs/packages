import { type EventTemplate as NostrToolsEventTemplate } from "nostr-tools";
import { z } from 'zod';
import { nostr_tag_client_schema } from "../schemas/lib.js";

export type NostrTagClient = z.infer<typeof nostr_tag_client_schema>;
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

export type NostrRelayInformationDocument = {
    id?: string;
    name?: string;
    description?: string;
    pubkey?: string;
    contact?: string;
    supported_nips?: number[];
    software?: string;
    version?: string;
    limitation_payment_required?: string;
    limitation_restricted_writes?: boolean;
}

export type NostrRelayInformationDocumentFields = { [K in keyof NostrRelayInformationDocument]: string; };

export type ILibNostrNeventEncode = {
    id: string;
    relays: string[];
    author: string;
    kind: number;
};

export type ILibNostrEventSign = {
    secret_key: string;
    event: NostrToolsEventTemplate;
};