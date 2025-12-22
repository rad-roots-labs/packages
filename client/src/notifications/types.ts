import { type IResultList } from "@radroots/types-bindings";
import { type ResolveError, type ResolveStatus } from "@radroots/utils";

export type IClientNotificationsNotifyPermission = "granted" | "denied" | "default" | "unavailable";

export type IClientNotificationsDialogConfirmOpts =
    | string
    | {
        message: string;
        title?: string;
        status?: ResolveStatus;
        cancel?: string;
        ok?: string;
    }

export type IClientNotificationsNotifySendOptions = {
    id?: string;
    channel_id?: string;
    title?: string;
    body?: string;
}

export type IClientNotificationsConfig = {
    app_name: string;
};

export type IClientNotificationsAlertResolve = boolean;
export type IClientNotificationsConfirmResolve = boolean;
export type IClientNotificationsNotifyInitResolve = ResolveError<IClientNotificationsNotifyPermission>;
export type IClientNotificationsNotifySendResolve = ResolveError<Notification>

export interface IClientNotifications {
    alert(opts: string, title?: string, status?: ResolveStatus): Promise<IClientNotificationsAlertResolve>;
    confirm(opts: IClientNotificationsDialogConfirmOpts): Promise<IClientNotificationsConfirmResolve>;
    notify_init(): Promise<IClientNotificationsNotifyInitResolve>;
    notify_send(opts: string | IClientNotificationsNotifySendOptions): Promise<IClientNotificationsNotifySendResolve>;
    open_photos(): Promise<ResolveError<IResultList<string> | undefined>>;
}
