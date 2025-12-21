import { cl_crypto_error } from "./error.js";
import type { CryptoEnvelope } from "./types.js";

const ENVELOPE_MAGIC = new Uint8Array([0x52, 0x52, 0x43, 0x45]);
const ENVELOPE_VERSION = 1;
const ENVELOPE_HEADER_LENGTH = 4 + 1 + 1 + 1 + 8;

const bytes_equal = (left: Uint8Array, right: Uint8Array): boolean => {
    if (left.length !== right.length) return false;
    for (let i = 0; i < left.length; i++) if (left[i] !== right[i]) return false;
    return true;
};

export const crypto_envelope_encode = (envelope: CryptoEnvelope): Uint8Array => {
    const encoder = new TextEncoder();
    const key_bytes = encoder.encode(envelope.key_id);
    if (key_bytes.length > 255) throw new Error(cl_crypto_error.invalid_key_id);
    const total_len = ENVELOPE_HEADER_LENGTH + key_bytes.length + envelope.iv.length + envelope.ciphertext.length;
    const out = new Uint8Array(total_len);
    const view = new DataView(out.buffer, out.byteOffset, out.byteLength);
    let offset = 0;
    out.set(ENVELOPE_MAGIC, offset);
    offset += ENVELOPE_MAGIC.length;
    out[offset] = ENVELOPE_VERSION;
    offset += 1;
    out[offset] = key_bytes.length;
    offset += 1;
    out[offset] = envelope.iv.length;
    offset += 1;
    view.setBigUint64(offset, BigInt(envelope.created_at), false);
    offset += 8;
    out.set(key_bytes, offset);
    offset += key_bytes.length;
    out.set(envelope.iv, offset);
    offset += envelope.iv.length;
    out.set(envelope.ciphertext, offset);
    return out;
};

export const crypto_envelope_decode = (blob: Uint8Array): CryptoEnvelope | null => {
    if (blob.byteLength < ENVELOPE_HEADER_LENGTH) return null;
    const magic = blob.slice(0, ENVELOPE_MAGIC.length);
    if (!bytes_equal(magic, ENVELOPE_MAGIC)) return null;
    const view = new DataView(blob.buffer, blob.byteOffset, blob.byteLength);
    let offset = ENVELOPE_MAGIC.length;
    const version = view.getUint8(offset);
    offset += 1;
    if (version !== ENVELOPE_VERSION) throw new Error(cl_crypto_error.invalid_envelope);
    const key_len = view.getUint8(offset);
    offset += 1;
    const iv_len = view.getUint8(offset);
    offset += 1;
    const created_at = Number(view.getBigUint64(offset, false));
    offset += 8;
    const remaining = blob.byteLength - offset;
    if (remaining < key_len + iv_len + 1) throw new Error(cl_crypto_error.invalid_envelope);
    const key_bytes = blob.slice(offset, offset + key_len);
    offset += key_len;
    const iv = blob.slice(offset, offset + iv_len);
    offset += iv_len;
    const ciphertext = blob.slice(offset);
    const decoder = new TextDecoder();
    const key_id = decoder.decode(key_bytes);
    if (!key_id) throw new Error(cl_crypto_error.invalid_key_id);
    return {
        version,
        key_id,
        iv,
        created_at,
        ciphertext
    };
};
