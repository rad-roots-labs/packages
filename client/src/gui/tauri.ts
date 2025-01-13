
import { type IClientGui, type IClientGuiDialogConfirmOpts, type IClientGuiDialogKind, type IClientGuiDialogResolve, type IClientGuiNotifyPermission, type IClientGuiNotifySendOptions } from '@radroots/utils';
import { confirm, type ConfirmDialogOptions, message, open, type OpenDialogOptions } from '@tauri-apps/plugin-dialog';
import {
    isPermissionGranted as isPermissionGrantedNotification,
    type Options as NotificationsOptions,
    requestPermission as requestPermissionNotification,
    sendNotification
} from '@tauri-apps/plugin-notification';

export class TauriClientGui implements IClientGui {
    public async alert(opts: string, title?: string, kind?: IClientGuiDialogKind): Promise<boolean> {
        await message(opts, { title: title || ``, kind: kind || `info` });
        return true;
    }

    public async confirm(opts: IClientGuiDialogConfirmOpts): Promise<boolean> {
        const msg = typeof opts === `string` ? opts : opts.message;
        const options: ConfirmDialogOptions = { title: `` };
        if (typeof opts !== `string`) {
            options.title = opts.title || ``;
            options.kind = opts.kind || `info`;
            if (opts.cancel) options.cancelLabel = opts.cancel;
            if (opts.ok) options.okLabel = opts.ok;
        }
        return await confirm(msg, options);
    }

    public notify_init = async (): Promise<IClientGuiNotifyPermission | undefined> => {
        return await requestPermissionNotification();
    }

    public notify_send = async (opts: string | IClientGuiNotifySendOptions): Promise<void> => {
        if (!(await isPermissionGrantedNotification())) {
            const permission = await this.notify_init();
            if (permission !== 'granted') return;
        };
        const options: NotificationsOptions = typeof opts === `string` ? {
            title: `Radroots`,
            body: opts
        } : {
            id: opts.id,
            channelId: opts.channel_id,
            title: opts.title,
            body: opts.body
        };
        sendNotification(options);
    }

    public async open_photos(): Promise<IClientGuiDialogResolve | undefined> {
        const options: OpenDialogOptions = {
            multiple: true,
            directory: false,
            filters: [{
                name: `Image`,
                extensions: ['png']
            }]
        };
        const res = await open(options) as any;
        if (Array.isArray(res)) return { results: res.map(i => String(i)) };
        else if (typeof res === `string`) return { results: [res] };
        return undefined;
    }
}
