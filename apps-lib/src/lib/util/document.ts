import { browser } from "$app/environment";

export const el_id = (id: string): HTMLElement | undefined => {
    const el = document.getElementById(id);
    return el ? el : undefined;
};

export const el_toggle = (id: string, toggle_class: string): void => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle(toggle_class);
};

export const els_id_pref = (id_pref: string): Element[] | undefined => {
    const els = document.querySelectorAll(`[id^="${id_pref}"]`);
    if (els && els.length) return Array.from(els);
    return undefined;
};

export const els_id_pref_index = (id_pref: string, num_index: number, orientation: `greater` | `lesser` | `not` = `greater`, inclusive: boolean = true): Element[] | undefined => {
    const els = document.querySelectorAll(`[id^="${`${id_pref}-`.replaceAll(`--`, `-`)}"]`);
    if (els && els.length) return Array.from(els).filter(el => {
        const match = el.id.match(/(?<=^|\-)[0-9]\d*(?=\-)/)
        if (match) {
            const num = parseInt(match[0], 10);
            switch (orientation) {
                case `greater`: {
                    if (inclusive) return num >= num_index;
                    else return num > num_index;
                }
                case `lesser`: {
                    if (inclusive) return num <= num_index;
                    else return num < num_index;
                }
                case `not`: {
                    return num !== num_index;
                }
            }
        }
        return false;
    });
    return undefined;
};

export const view_effect = <T extends string>(view: T): void => {
    console.log(`view_effect `, view)
    if (!browser) return;
    for (const el of document.querySelectorAll(`[data-view]`)) {
        if (el.getAttribute(`data-view`) !== view) el.classList.add(`hidden`)
        else el.classList.remove(`hidden`)
    }
};

