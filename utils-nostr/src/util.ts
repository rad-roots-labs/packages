import { type ErrorMessage } from "$root";
import { v4 } from "uuid";

export const time_now_ms = (): number => Math.floor(new Date().getTime() / 1000);

export const uuidv4 = (): string => v4();

export const err_msg = <T extends string>(err: T): ErrorMessage<T> => {
    return { err };
};