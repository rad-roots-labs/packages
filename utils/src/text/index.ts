export const root_symbol = "»`,-";

export function text_enc(data: string): Uint8Array {
    return new TextEncoder().encode(data);
}

export function text_dec(data: Uint8Array): string {
    return new TextDecoder().decode(data);
}

export const str_cap = (val?: string): string => {
    if (!val) return ``;
    return `${val[0].toUpperCase()}${val.slice(1)}`;
};

export const str_cap_words = (val?: string): string => {
    if (!val) return ``;
    return val.split(` `).map(i => i ? str_cap(i) : ``).filter(i => !!i).join(` `);
};
