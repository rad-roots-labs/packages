import type { ViewProfileEditFieldKey } from "$lib/types/views/profile";

export const parse_view_profile_field_key = (val?: string | null): ViewProfileEditFieldKey | undefined => {
    switch (val) {
        case `name`:
        case `display_name`:
        case `about`:
            return val;
        default:
            return undefined;
    }
};