import { IError } from "@radroots/types-bindings";

export const err_msg = <T extends string>(err: T | IError<T>): IError<T> => {
    return typeof err === "string" ? { err } : err;
};

export const throw_err = (param: string | IError<string>): never => {
    if (typeof param === `string`) throw new Error(param);
    else throw new Error(param.err);
};

export const handle_err = (e: unknown, append?: string): IError<string> => {
    console.log(`[handle_err] `, e, append || "");
    const msg = (e as Error).message ? (e as Error).message : String(e);
    const err = `${msg}${append ? ` ${append}` : ``}`;
    return { err };
};