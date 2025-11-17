import type { NostrProfile } from "@radroots/tangle-schema-bindings";

export type IViewProfileData = {
    profile: NostrProfile
};

export type ViewProfileEditFieldKey = `name` | `display_name` | `about`;

export type IViewProfileEditData = {
    public_key: string;
    field: ViewProfileEditFieldKey;
};
