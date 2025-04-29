import type { CallbackPromiseGeneric } from "@radroots/util";

export type IViewHomeData = {};

export type IViewOnMount<TypeCallbackParam> = {
    on_mount: CallbackPromiseGeneric<TypeCallbackParam>;
};

export type IViewOnDestroy<TypeCallbackParam> = {
    on_destroy: CallbackPromiseGeneric<TypeCallbackParam>;
};
