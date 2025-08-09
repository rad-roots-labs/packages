import { z } from 'zod';

export const nostr_event_metadata_schema = z.object({
    name: z.string(),
    display_name: z.string().optional(),
    about: z.string().optional(),
    website: z.url().optional(),
    picture: z.url().optional(),
    banner: z.url().optional(),
    nip05: z.string().optional(),
    lud06: z.string().optional(),
    lud16: z.string().optional(),
    bot: z.boolean().optional(),
});

export const nostr_tag_listing_schema = z.object({
    key: z.string(),
    title: z.string(),
    category: z.string(),
    summary: z.string().optional(),
    process: z.string().optional(),
    lot: z.string().optional(),
    location: z.string().optional(),
    profile: z.string().optional(),
    year: z.string().optional()
});

export const nostr_tag_quantity_schema = z.object({
    amt: z.string(),
    unit: z.string(),
    label: z.string().optional()
});

export const nostr_tag_price_schema = z.object({
    amt: z.string(),
    currency: z.string(),
    qty_amt: z.string(),
    qty_unit: z.string(),
    qty_key: z.string()
});

export const nostr_tag_discount_schema = z.union([
    z.object({
        quantity: z.object({
            ref_quantity: z.string(),
            threshold: z.string(),
            value: z.string(),
            currency: z.string()
        })
    }),
    z.object({
        mass: z.object({
            unit: z.string(),
            threshold: z.string(),
            threshold_unit: z.string(),
            value: z.string(),
            currency: z.string()
        })
    }),
    z.object({
        subtotal: z.object({
            threshold: z.string(),
            currency: z.string(),
            value: z.string(),
            measure: z.string()
        })
    }),
    z.object({
        total: z.object({
            total_min: z.string(),
            value: z.string(),
            measure: z.string()
        })
    })
]);

export const nostr_tag_location_schema = z.object({
    primary: z.string(),
    city: z.string().optional(),
    region: z.string().optional(),
    country: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional()
});

export const nostr_tag_image_schema = z.object({
    url: z.string(),
    size: z
        .object({
            w: z.number(),
            h: z.number()
        })
        .optional()
});

export const nostr_tag_client_schema = z.object({
    name: z.string(),
    pubkey: z.string(),
    relay: z.string()
});

export const nostr_event_listing_schema = z.object({
    d_tag: z.string(),
    listing: nostr_tag_listing_schema,
    quantities: z.array(nostr_tag_quantity_schema),
    prices: z.array(nostr_tag_price_schema),
    discounts: z.array(nostr_tag_discount_schema).optional(),
    location: nostr_tag_location_schema.optional(),
    images: z.array(nostr_tag_image_schema).optional(),
    client: nostr_tag_client_schema.optional()
});

export const nostr_event_referenced_schema = z.object({
    id: z.string().regex(/^[0-9a-f]{64}$/i, "expected 64-char hex id"),
    kind: z.number().int().nonnegative(),
    author: z.string().regex(/^[0-9a-f]{64}$/i, "expected 64-char hex pubkey"),
    relays: z.array(z.url()).nonempty().optional(),
    d_tag: z.string().min(1).optional(),
});

export const nostr_event_comment_schema = z.object({
    root_event: nostr_event_referenced_schema,
    ref_event: nostr_event_referenced_schema.optional(),
    content: z.string().min(1),
});

export const nostr_event_reaction_schema = z.object({
    ref_event: nostr_event_referenced_schema,
    content: z.string().min(1),
});

export const nostr_follow_list_schema = z.object({
    public_key: z.string(),
    relay_url: z.url().optional(),
    contact_name: z.string().optional()
});

export const nostr_event_follow_schema = z.object({
    list: z.array(nostr_follow_list_schema)
});
