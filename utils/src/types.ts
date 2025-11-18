export type FieldRecord = Record<string, string>;

export type ResolveStatus = "info" | "warning" | "error" | "success";

export type NotifyMessage = {
    message: string;
    ok?: string;
    cancel?: string;
};

export type FileBytesFormat = `kb` | `mb` | `gb`;
export type FileMimeType = string;
export type FilePath = { file_path: string; file_name: string; mime_type: FileMimeType; }

export type ValStr = string | undefined | null