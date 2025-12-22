import type { CallbackPromise } from "@radroots/utils";

export type IViewBasis<T extends object> = {
    kv_init_prevent?: boolean;
    on_mount?: CallbackPromise;
    on_destroy?: CallbackPromise;
} & T;

export type IViewHomeData = {};
