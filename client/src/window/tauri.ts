import { invoke } from "@tauri-apps/api/core";
import type { IClientWindow } from "./types";

export class TauriClientWindow implements IClientWindow {
    public async splash_hide(): Promise<void> {
        try {
            await invoke('hide_splashscreen')
        } catch (e) { };
    }

    public async splash_show(showDuration?: number): Promise<void> {
        try {
            await invoke('show_splashscreen')

        } catch (e) { };
    }
}
