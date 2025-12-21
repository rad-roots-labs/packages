import { IResultList } from "@radroots/types-bindings";
import { err_msg, handle_err, type ResolveError, type ResolveStatus } from "@radroots/utils";
import { cl_notifications_error } from "./error.js";
import type {
    IClientNotifications,
    IClientNotificationsAlertResolve,
    IClientNotificationsConfig,
    IClientNotificationsConfirmResolve,
    IClientNotificationsDialogConfirmOpts,
    IClientNotificationsNotifyInitResolve,
    IClientNotificationsNotifySendOptions,
    IClientNotificationsNotifySendResolve
} from "./types.js";

export interface IWebNotifications extends IClientNotifications {}

export class WebNotifications implements IWebNotifications {
    private _config: IClientNotificationsConfig;

    constructor(config: IClientNotificationsConfig = { app_name: "Radroots" }) {
        this._config = config;
    }
    public async alert(opts: string, title?: string, kind?: ResolveStatus): Promise<IClientNotificationsAlertResolve> {
        try {
            const msg = title ? `${title}\n\n${opts}` : opts;
            window.alert(msg);
            return true;
        } catch (e) {
            handle_err(e);
            return false;
        }
    }

    public async confirm(opts: IClientNotificationsDialogConfirmOpts): Promise<IClientNotificationsConfirmResolve> {
        try {
            const msg = typeof opts === 'string' ? opts : opts.message
            return window.confirm(msg);
        } catch (e) {
            handle_err(e);
            return false;
        }
    }

    public async notify_init(): Promise<IClientNotificationsNotifyInitResolve> {
        try {
            if (!("Notification" in window)) return "unavailable";
            if (Notification.permission === 'granted') return "granted";
            return await Notification.requestPermission();
        } catch (e) {
            return handle_err(e);
        }
    }

    public async notify_send(opts: string | IClientNotificationsNotifySendOptions): Promise<IClientNotificationsNotifySendResolve> {
        try {
            if (!("Notification" in window)) return err_msg(cl_notifications_error.unavailable);
            if (Notification.permission !== "granted") {
                const permission = await this.notify_init();
                if (permission !== "granted") return err_msg(cl_notifications_error.unavailable);
            }
            if (typeof opts === "string") return new Notification(this._config.app_name, { body: opts });
            else return new Notification(opts.title || this._config.app_name, { body: opts.body });
        } catch (e) {
            return handle_err(e);
        }
    }

    public async open_photos(): Promise<ResolveError<IResultList<string> | undefined>> {
        return await new Promise<IResultList<string> | undefined>((resolve) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.accept = 'image/png,image/jpg';
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
