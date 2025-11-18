import { createStore, del as idb_del, get as idb_get, set as idb_set } from "idb-keyval";

function asArrayBuffer(u8: Uint8Array): ArrayBuffer {
    if (u8.byteOffset === 0 && u8.buffer instanceof ArrayBuffer && u8.byteLength === u8.buffer.byteLength) {
        return u8.buffer;
    }
    return u8.slice().buffer;
}

export class AesGcmKeystoreCipher {
    private static readonly dbName = "radroots-aes-gcm-keystore";
    private static readonly storeName = "default";
    private static readonly keystoreKey = "radroots.aes-gcm.key";
    private static readonly algorithmName = "AES-GCM";
    private static readonly keyUsages: KeyUsage[] = ["encrypt", "decrypt"];
    private static readonly ivLength = 12;
    private static readonly store = createStore(AesGcmKeystoreCipher.dbName, AesGcmKeystoreCipher.storeName);
    private static cachedKey: CryptoKey | null = null;

    private static async importKey(rawKey: Uint8Array): Promise<CryptoKey> {
        return crypto.subtle.importKey(
            "raw",
            asArrayBuffer(rawKey),
            AesGcmKeystoreCipher.algorithmName,
            false,
            AesGcmKeystoreCipher.keyUsages
        );
    }

    private static async generateAndPersistKey(): Promise<CryptoKey> {
        const key = await crypto.subtle.generateKey(
            { name: AesGcmKeystoreCipher.algorithmName, length: 256 },
            true,
            AesGcmKeystoreCipher.keyUsages
        );
        const raw = new Uint8Array(await crypto.subtle.exportKey("raw", key));
        try {
            await idb_set(AesGcmKeystoreCipher.keystoreKey, raw, AesGcmKeystoreCipher.store);
            const importedKey = await AesGcmKeystoreCipher.importKey(raw);
            AesGcmKeystoreCipher.cachedKey = importedKey;
            return importedKey;
        } finally {
            raw.fill(0);
        }
    }

    static async load_key(): Promise<CryptoKey> {
        if (AesGcmKeystoreCipher.cachedKey) {
            return AesGcmKeystoreCipher.cachedKey;
        }
        const existing = await idb_get(AesGcmKeystoreCipher.keystoreKey, AesGcmKeystoreCipher.store);
        if (existing instanceof Uint8Array) {
            const key = await AesGcmKeystoreCipher.importKey(existing);
            AesGcmKeystoreCipher.cachedKey = key;
            return key;
        }
        return AesGcmKeystoreCipher.generateAndPersistKey();
    }

    static async reset(): Promise<void> {
        AesGcmKeystoreCipher.cachedKey = null;
        await idb_del(AesGcmKeystoreCipher.keystoreKey, AesGcmKeystoreCipher.store);
    }

    static async encrypt(data: Uint8Array): Promise<Uint8Array> {
        const key = await AesGcmKeystoreCipher.load_key();
        const iv = crypto.getRandomValues(new Uint8Array(AesGcmKeystoreCipher.ivLength));
        const ciphertextBuffer = await crypto.subtle.encrypt(
            { name: AesGcmKeystoreCipher.algorithmName, iv: asArrayBuffer(iv) },
            key,
            asArrayBuffer(data)
        );
        const ciphertext = new Uint8Array(ciphertextBuffer);
        const out = new Uint8Array(AesGcmKeystoreCipher.ivLength + ciphertext.byteLength);
        out.set(iv, 0);
        out.set(ciphertext, AesGcmKeystoreCipher.ivLength);
        return out;
    }

    static async decrypt(blob: Uint8Array): Promise<Uint8Array> {
        if (blob.byteLength < AesGcmKeystoreCipher.ivLength + 1) {
            return blob;
        }
        const key = await AesGcmKeystoreCipher.load_key();
        const iv = blob.slice(0, AesGcmKeystoreCipher.ivLength);
        const ciphertext = blob.slice(AesGcmKeystoreCipher.ivLength);
        try {
            const plaintext = await crypto.subtle.decrypt(
                { name: AesGcmKeystoreCipher.algorithmName, iv: asArrayBuffer(iv) },
                key,
                asArrayBuffer(ciphertext)
            );
            return new Uint8Array(plaintext);
        } catch {
            return blob;
        }
    }
}
