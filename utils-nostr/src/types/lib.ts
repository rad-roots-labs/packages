import { z } from 'zod';
import { nostr_event_metadata_schema } from "../schemas/lib.js";

export type NostrEventMetadata = z.infer<typeof nostr_event_metadata_schema>;
