export const el_id = (id: string): HTMLElement | undefined => {
    const el = document.getElementById(id);
    return el ? el : undefined;
};

export const el_toggle = (id: string, toggle_class: string): void => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle(toggle_class);
};
