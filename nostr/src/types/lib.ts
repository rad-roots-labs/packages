import { type EventTemplate } from "nostr-tools";
import { z } from "zod";
import { nostr_tag_client_schema } from "../schemas/lib.js";

export type NostrTagClient = z.infer<typeof nostr_tag_client_schema>;
export type NostrEventTag = string[];
export type NostrEventTags = NostrEventTag[];

export type NostrEventTagClient = {
    name: string;
    pubkey: string;
    relay: string;
};

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

export type NostrNeventEncode = {
    id: string;
    relays: string[];
    author: string;
    kind: number;
};

export type NostrEventSign = {
    secret_key: string;
    event: EventTemplate;
};
