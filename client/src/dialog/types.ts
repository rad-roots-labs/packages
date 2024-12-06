import type { ResultsList } from "@radroots/utils";

export type IClientDialogPrompt = {
    title?: string;
    message: string;
    ok_button_title?: string;
    cancel_button_title?: string;
    input_placeholder?: string;
    input_text?: string;
};

export type IClientDialogKind = "info" | "warning" | "error";

export type IClientDialogAlertOpts = string;

export type IClientDialogConfirmOpts = string | { title?: string, kind?: IClientDialogKind; message: string; cancel_label?: string; ok_label?: string; };

export type IClientDialogResolve = ResultsList<string>;

export type IClientDialog = {
    alert(opts: IClientDialogAlertOpts): Promise<boolean>;
    confirm(opts: IClientDialogConfirmOpts): Promise<boolean>;
    open_photos(): Promise<IClientDialogResolve | undefined>;
    //prompt(opts: IClientDialogPrompt): Promise<string | false>;
};