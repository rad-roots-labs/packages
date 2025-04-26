export type NostrEventTag = string[];
export type NostrEventTags = NostrEventTag[];
export type ErrorMessage<T extends string> = { err: T };
export type ResolveError<T> = T | ErrorMessage<string>;
