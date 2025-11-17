import type { AppLayoutKey, LabelFieldKind } from "$lib/types/app";
import type { ThemeLayer } from "@radroots/themes";

type ConfigWindow = {
    layout: Record<AppLayoutKey, {
        h: number;
    }>;
    debounce: {
        search: number;
    }
};

export const cfg_app: ConfigWindow = {
    layout: {
        ios0: {
            h: 600
        },
        ios1: {
            h: 750
        },
        webm0: {
            h: 600
        },
        webm1: {
            h: 750
        }
    },
    debounce: {
        search: 200
    },
};

export const fmt_trellis = (hide_border_t: boolean, hide_border_b: boolean): string => {
    return `${hide_border_t ? `group-first:border-t-0` : `group-first:border-t-line`} ${hide_border_b ? `group-last:border-b-0` : `group-last:border-b-line`}`;
};

export const get_label_classes_kind = (layer: ThemeLayer, label_kind: LabelFieldKind | undefined, hide_active: boolean): string => {
    return `text-ly${layer}-gl${label_kind ? `-${label_kind}` : ``} ${hide_active ? `` : `group-active:text-ly${layer}-gl${label_kind ? `-${label_kind}_a` : `_a`}`}`
};