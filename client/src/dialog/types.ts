export type IClientDialogPrompt = {
    title?: string;
    message: string;
    ok_button_title?: string;
    cancel_button_title?: string;
    input_placeholder?: string;
    input_text?: string;
};

export type IClientDialogKind = "info" | "warning" | "error";

export type IClientDialogConfirmOpts = string | { title?: string, kind?: IClientDialogKind; message: string; cancel_label?: string; ok_label?: string; };

export type IClientDialog = {
    alert(message: string): Promise<boolean>;
    confirm(opts: IClientDialogConfirmOpts): Promise<boolean>;
    //prompt(opts: IClientDialogPrompt): Promise<string | false>;
};