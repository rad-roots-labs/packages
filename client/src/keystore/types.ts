import type { ErrorMessage, ResultObj, ResultPass, ResultsList } from "@radroots/utils";
import type { IClientUnlisten } from "../types";

export type IClientKeystore = {
    init(): Promise<void>;
    set(key: string, val: string): Promise<ResultPass | ErrorMessage<string>>;
    get(key: string): Promise<ResultObj<string> | ErrorMessage<string>>;
    keys(): Promise<ResultsList<string> | ErrorMessage<string>>;
    entries(): Promise<ResultsList<[string, unknown]> | ErrorMessage<string>>
    remove(key: string): Promise<ResultPass | ErrorMessage<string>>;
    on_key_change(key: string, callback: (value: string | null) => Promise<void>): Promise<IClientUnlisten | ErrorMessage<string>>;
};