import { confirm, type ConfirmDialogOptions, message } from '@tauri-apps/plugin-dialog';
import type { IClientDialog, IClientDialogConfirmOpts, IClientDialogKind } from "./types";

export class TauriClientDialog implements IClientDialog {
    public async alert(msg: string, title?: string, kind?: IClientDialogKind): Promise<boolean> {
        try {
            await message(msg, { title: title || ``, kind: kind || `info` });
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
}
