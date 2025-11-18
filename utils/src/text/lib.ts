export const root_symbol = "»`,-";

export function text_enc(data: string): Uint8Array {
    return new TextEncoder().encode(data);
}

export function text_dec(data: Uint8Array): string {
    return new TextDecoder().decode(data);
}