import { confirm, type ConfirmDialogOptions, message, open, type OpenDialogOptions } from '@tauri-apps/plugin-dialog';
import type { IClientDialog, IClientDialogConfirmOpts, IClientDialogKind, IClientDialogResolve } from "./types";

export class TauriClientDialog implements IClientDialog {
    public async alert(opts: string, title?: string, kind?: IClientDialogKind): Promise<boolean> {
        try {
            await message(opts, { title: title || ``, kind: kind || `info` });
            return true;
        } catch (e) {
            return false;
        };
    }

    public async confirm(opts: IClientDialogConfirmOpts): Promise<boolean> {
        try {
            const msg = typeof opts === `string` ? opts : opts.message;
            const options: ConfirmDialogOptions = { title: `` };
            if (typeof opts !== `string`) {
                options.title = opts.title || ``;
                options.kind = opts.kind || `info`;
                if (opts.cancel_label) options.cancelLabel = opts.cancel_label;
                if (opts.ok_label) options.okLabel = opts.ok_label;
            }
            const res = await confirm(msg, options);
            return res;
        } catch (e) {
            return false;
        };
    }

    public async open_photos(): Promise<IClientDialogResolve | undefined> {
        try {
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
        } catch (e) {
            return undefined;
        };
    }
}
