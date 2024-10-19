import type { ErrorMessage, ResultObj } from "@radroots/utils";

export type IClientOs = {
    version(): string;
    platform(): string;
    arch(): string;
    hostname(): Promise<ResultObj<string> | ErrorMessage<string>>
};