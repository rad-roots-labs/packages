import type { ErrorMessage } from "@radroots/utils";


export type IClientKeyring = {
    set_nostr_key(key: string, val: string): Promise<true | ErrorMessage<string>>;
    get_nostr_key(key: string): Promise<{ result: string } | ErrorMessage<string>>;
};