import { z } from 'zod';

export const nostr_tag_client_schema = z.object({
    name: z.string(),
    pubkey: z.string(),
    relay: z.string()
});