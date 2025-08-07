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
