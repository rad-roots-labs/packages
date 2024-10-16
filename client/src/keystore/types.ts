import type { ErrorMessage } from "@radroots/utils";
import type { UnlistenFn } from "@tauri-apps/api/event";

export type IClientKeystoreUnlisten = UnlistenFn;

export type IClientKeystore = {
    init: () => Promise<void>;
    set(key: string, val: string): Promise<{ pass: true } | ErrorMessage<string>>;
    get(key: string): Promise<{ result: string } | ErrorMessage<string>>;
    keys(): Promise<{ results: string[] } | ErrorMessage<string>>;
    remove(key: string): Promise<boolean | ErrorMessage<string>>;
    on_key_change(key: string, callback: (value: string | null) => Promise<void>): Promise<IClientKeystoreUnlisten | ErrorMessage<string>>;
};