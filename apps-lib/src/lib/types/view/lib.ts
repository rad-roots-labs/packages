import type { CallbackPromiseGeneric } from "@radroots/util";

export type IViewHomeData = {};

export type IViewOnMount<TypeCallbackParam> = {
    lc_on_mount: CallbackPromiseGeneric<TypeCallbackParam>;
};

export type IViewOnDestroy<TypeCallbackParam> = {
    lc_on_destroy: CallbackPromiseGeneric<TypeCallbackParam>;
};
