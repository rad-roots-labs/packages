
import {
    isPermissionGranted,
    requestPermission,
    sendNotification
} from '@tauri-apps/plugin-notification';
import type { IClientNotification, IClientNotificationPermission, IClientNotificationSendOptions } from "./types";

export class TauriClientNotification implements IClientNotification {
    public async init(): Promise<IClientNotificationPermission | undefined> {
        try {
            const permission = await requestPermission();
            return permission;
        } catch (e) {
            console.log(`e init`, e)
        };
    }

    public async send(opts: string | IClientNotificationSendOptions): Promise<void> {
        try {
            if (!(await isPermissionGranted())) {
                const permission = await this.init();
                if (permission !== 'granted') return;
            };

            sendNotification(typeof opts === `string` ? { title: `Radroots`, body: opts } : opts);
        } catch (e) {
            console.log(`e send`, e)
        };
    }
}
