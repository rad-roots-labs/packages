import type { IClientUnlisten } from "../types";

export type IClientLogger = {
    init(): Promise<IClientUnlisten>;
};