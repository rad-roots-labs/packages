import type { CallbackPromiseGeneric } from "./client";
import type { GlyphKey, GlyphWeight } from "./ui";

export type ITabsBasisList = {
    icon: GlyphKey;
    classes?: string;
    active_weight?: GlyphWeight;
    indicator?: string
    callback: CallbackPromiseGeneric<number>;
};

export type ITabsBasis = {
    list: ITabsBasisList[];
    blur?: boolean;
    tab_active: number;
    app_layout: string;
};

