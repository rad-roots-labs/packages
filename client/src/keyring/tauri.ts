import { err_msg, type ErrorMessage } from '@radroots/utils';
import { invoke } from "@tauri-apps/api/core";
import type { IClientKeyring } from './types';

export class TauriClientKeying implements IClientKeyring {
    public async set_nostr_key(secret_key_hex: string): Promise<true | ErrorMessage<string>> {
        try {
            const response = await invoke<any>("keyring_nostr_key_set", { secretKeyHex: secret_key_hex });
            console.log(`response set_nostr_key`, response)
            return true;
        } catch (e) {
            return err_msg(`*`);
        }
    }

    public async get_nostr_key(public_key_hex: string): Promise<{ result: string } | ErrorMessage<string>> {
        try {
            const response = await invoke<any>("keyring_nostr_key_get", { publicKeyHex: public_key_hex });
            console.log(`response `, response);
            if (response && typeof response === `string`) return { result: response };
            return err_msg(`*-result`);
        } catch (e) {
            return err_msg(`*`);
        }
    }
}
