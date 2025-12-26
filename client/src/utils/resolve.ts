import type { IError } from "@radroots/types-bindings";
import type { ResolveError } from "@radroots/utils";

export const is_error = <T>(value: ResolveError<T>): value is IError<string> =>
    typeof value === "object" && value !== null && "err" in value;
