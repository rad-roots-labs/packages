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

export const els_id_pref_index = (id_pref: string, num_index: number, orientation: `greater` | `lesser` = `greater`): Element[] | undefined => {
    const els = document.querySelectorAll(`[id^="${`${id_pref}-`.replaceAll(`--`, `-`)}"]`);
    if (els && els.length) return Array.from(els).filter(el => {
        const match = el.id.match(/(?<=^|\-)[0-9]\d*(?=\-)/)
        if (match) {
            const num = parseInt(match[0], 10);
            return orientation === `greater` ? num >= num_index : num <= num_index;
        }
        return false;
    });
    return undefined;
};

