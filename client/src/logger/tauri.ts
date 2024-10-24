import { attachConsole } from '@tauri-apps/plugin-log';
import type { IClientUnlisten } from '../types';
import type { IClientLogger } from "./types";

export class TauriClientLogger implements IClientLogger {
    public async init(): Promise<IClientUnlisten> {
        return await attachConsole();
    }
}
