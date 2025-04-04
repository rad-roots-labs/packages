import type { CallbackPromiseGeneric } from "@radroots/util";

export type IViewProfileData = {
    public_key: string;
    name?: string;
    display_name?: string;
    about?: string;
    picture?: string;
};

export type ViewProfileEditFieldKey = `name` | `display_name` | `about`;

export type IViewProfileEditData = {
    public_key: string;
    field: ViewProfileEditFieldKey;
};

export type IViewOnMount<TypeCallbackParam> = {
    lc_on_mount: CallbackPromiseGeneric<TypeCallbackParam>;
};

export type IViewOnDestroy<TypeCallbackParam> = {
    lc_on_destroy: CallbackPromiseGeneric<TypeCallbackParam>;
};
