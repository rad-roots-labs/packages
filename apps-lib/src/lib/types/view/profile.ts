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
