export function as_array_buffer(u8: Uint8Array): ArrayBuffer {
    if (u8.byteOffset === 0 && u8.buffer instanceof ArrayBuffer && u8.byteLength === u8.buffer.byteLength) {
        return u8.buffer;
    }
    return u8.slice().buffer;
}
