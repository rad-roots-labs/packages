import type { Options } from "@tauri-apps/plugin-notification";

export type IClientNotificationPermission = "default" | "denied" | "granted";
export type IClientNotificationSendOptions = Options;

export type IClientNotification = {
    init(): Promise<IClientNotificationPermission | undefined>;
    send(opts: string | IClientNotificationSendOptions): Promise<void>;
};