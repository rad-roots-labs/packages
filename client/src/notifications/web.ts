import { IResultList } from "@radroots/types-bindings";
import { err_msg, handle_err, type ResolveStatus } from "@radroots/utils";
import type { IClientNotifications, IClientNotificationsConfig, IClientNotificationsDialogConfirmOpts, IClientNotificationsNotifySendOptions } from "./types.js";

export class WebNotifications implements IClientNotifications {
    private _config: IClientNotificationsConfig;

    constructor(config: IClientNotificationsConfig = { app_name: "Radroots" }) {
        this._config = config;
    }
    public async alert(opts: string, title?: string, kind?: ResolveStatus) {
        try {
            const msg = title ? `${title}\n\n${opts}` : opts;
            window.alert(msg);
            return true;
        } catch (e) {
            handle_err(e);
            return false;
        }
    }

    public async confirm(opts: IClientNotificationsDialogConfirmOpts) {
        try {
            const msg = typeof opts === 'string' ? opts : opts.message
            return window.confirm(msg);
        } catch (e) {
            handle_err(e);
            return false;
        }
    }

    public async notify_init() {
        try {
            if (!("Notification" in window)) return "unavailable";
            if (Notification.permission === 'granted') return "granted";
            return await Notification.requestPermission();
        } catch (e) {
            return handle_err(e);
        }
    }

    public async notify_send(opts: string | IClientNotificationsNotifySendOptions) {
        try {
            if (!("Notification" in window)) return err_msg("unavailable");
            if (Notification.permission !== "granted") {
                const permission = await this.notify_init();
                if (permission !== "granted") return err_msg("unavailable");
            }
            if (typeof opts === "string") return new Notification(this._config.app_name, { body: opts });
            else return new Notification(opts.title || this._config.app_name, { body: opts.body });
        } catch (e) {
            return handle_err(e);
        }
    }

    public async open_photos() {
        return await new Promise<IResultList<string> | undefined>((resolve) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.accept = 'image/png';
            input.onchange = () => {
                const files = input.files;
                if (!files) return resolve(undefined);
                const results: string[] = [];
                for (let i = 0; i < files.length; i++) {
                    const url = URL.createObjectURL(files[i]!);
                    results.push(url);
                }
                resolve({ results });
            }
            input.click();
        })
    }
}
