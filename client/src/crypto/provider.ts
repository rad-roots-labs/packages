import { cl_crypto_error } from "./error.js";
import type { KeyMaterialProvider } from "./types.js";
import { crypto_registry_get_device_material, crypto_registry_set_device_material } from "./registry.js";

const DEVICE_PROVIDER_ID = "device";
const DEVICE_MATERIAL_BYTES = 32;

export interface IDeviceKeyMaterialProvider extends KeyMaterialProvider { }

export class DeviceKeyMaterialProvider implements IDeviceKeyMaterialProvider {
    public async get_key_material(): Promise<Uint8Array> {
        if (!globalThis.crypto) throw new Error(cl_crypto_error.crypto_undefined);
        const existing = await crypto_registry_get_device_material();
        if (existing) return new Uint8Array(existing);
        const material = new Uint8Array(DEVICE_MATERIAL_BYTES);
        crypto.getRandomValues(material);
        await crypto_registry_set_device_material(material);
        return new Uint8Array(material);
    }

    public async get_provider_id(): Promise<string> {
        return DEVICE_PROVIDER_ID;
    }
}
