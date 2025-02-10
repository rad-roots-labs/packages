
import { err_msg, is_pass_response, is_result_response, is_results_response, lib_nostr_secret_key_validate } from '@radroots/util';
import { invoke } from '@tauri-apps/api/core';
import type { IClientKeys, IClientKeysNostrAddResolve, IClientKeysNostrCreateResolve, IClientKeysNostrDeleteResolve, IClientKeysNostrKeystoreResetResolve, IClientKeysNostrReadAllResolve, IClientKeysNostrReadResolve } from './types';

export class TaurIClientKeys implements IClientKeys {
    private async command(cmd: string, opts?: any): Promise<any> {
        return await invoke<any>(cmd, opts ? opts : undefined);
    };

    public nostr_gen = async (): Promise<IClientKeysNostrCreateResolve> => {
        try {
            const response = await this.command("keys_nostr_gen");
            if (is_result_response(response)) return { public_key: response.result };
            return err_msg(`*-result`);
        } catch (e) {
            return err_msg(`*`);
        }
    }

    public nostr_add = async (nsec_or_hex: string): Promise<IClientKeysNostrAddResolve> => {
        try {
            const secret_key = lib_nostr_secret_key_validate(nsec_or_hex);
            if (!secret_key) return err_msg(`*-key`);
            const response = await this.command("keys_nostr_create", { secret_key });
            if (is_result_response(response)) return { public_key: response.result };
            return err_msg(`*-result`);
        } catch (e) {
            return err_msg(`*`);
        }
    }

    public nostr_read = async (public_key: string): Promise<IClientKeysNostrReadResolve> => {
        try {
            const response = await this.command("keys_nostr_read", { public_key });
            if (is_result_response(response)) return { secret_key: response.result };
            return err_msg(`*-result`);
        } catch (e) {
            return err_msg(`*`);
        }
    }

    public nostr_read_all = async (): Promise<IClientKeysNostrReadAllResolve> => {
        try {
            const response = await this.command("keys_nostr_read_all");
            if (is_results_response(response)) return { results: response.results };
            return err_msg(`*-result`);
        } catch (e) {
            return err_msg(`*`);
        }
    }

    public nostr_delete = async (public_key: string): Promise<IClientKeysNostrDeleteResolve> => {
        try {
            const response = await this.command("keys_nostr_delete", { public_key });
            if (is_pass_response(response)) return { pass: true };
            return err_msg(`*-result`);
        } catch (e) {
            return err_msg(`*`);
        }
    }

    public nostr_keystore_reset = async (): Promise<IClientKeysNostrKeystoreResetResolve> => {
        try {
            const response = await this.command("keys_nostr_keystore_reset");
            if (is_pass_response(response)) return { pass: true };
            return err_msg(`*`);
        } catch (e) {
            return err_msg(`*`);
        }
    }
}
