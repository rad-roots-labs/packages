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

export interface IWebNotifications extends IClientNotifications { }

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

    private async read_photo_data(file: File): Promise<string> {
        return await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result === "string") return resolve(reader.result);
                return reject(new Error(cl_notifications_error.read_failure));
            };
            reader.onerror = () => {
                if (reader.error) return reject(reader.error);
                return reject(new Error(cl_notifications_error.read_failure));
            };
            reader.readAsDataURL(file);
        });
    }

    public async open_photos(): Promise<ResolveError<IResultList<string> | undefined>> {
        try {
            const files = await new Promise<FileList | null>((resolve) => {
                const input = document.createElement('input');
                input.type = 'file';
                input.multiple = true;
                input.accept = 'image/png,image/jpg';
                input.onchange = () => resolve(input.files);
                input.click();
            });
            if (!files) return;
            const results: string[] = [];
            for (let i = 0; i < files.length; i++) {
                const file = files.item(i);
                if (!file) continue;
                const data_url = await this.read_photo_data(file);
                results.push(data_url);
            }
            return { results };
        } catch (e) {
            return handle_err(e);
        }
    }
}
