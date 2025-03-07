import type { ViewProfileEditFieldKey } from "$root";

export const parse_view_profile_field_key = (val?: string): ViewProfileEditFieldKey | undefined => {
    switch (val) {
        case `name`:
        case `display_name`:
        case `about`:
            return val;
        default:
            return undefined;
    }
};