export type IViewProfileData = {
    public_key: string;
    name?: string;
    display_name?: string;
    about?: string;
    photos?: {
        src: string;
        primary: boolean;
    }[];
};
