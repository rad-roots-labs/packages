import { page } from "$app/stores";
import { get_store } from "$lib";

export type IErrorCatchCallback = {
    name: string;
    message: string;
    stack: string;
    url: string;
    func: string;
};

export const catch_err = async (e: unknown, func: string, callback: (opts: IErrorCatchCallback) => Promise<void>): Promise<void> => {
    const $page = get_store(page) as any;
    let name = ``;
    let message = ``;
    let stack = ``;
    let url = ``;
    if (e instanceof Error) {
        name = e.name;
        message = e.message;
        stack = e.stack;
        url = $page.url.pathname;
    }
    await callback({ name, message, stack, url, func });
};

export const handle_err = async (e: unknown, fcall: string): Promise<void> => {
    try {
        return void await catch_err(e, fcall, async (opts) => {
            console.log(`handle_err e `, e)
            console.log(JSON.stringify(opts, null, 4), `handle_err opts`)
        });
    } catch (e) {
        console.log(`(handle_err) `, e)
    }
};